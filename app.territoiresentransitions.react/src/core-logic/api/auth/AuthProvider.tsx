import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {User, SignInWithPasswordCredentials} from '@supabase/supabase-js';
import {useQuery} from 'react-query';
import {supabaseClient} from '../supabase';
import {useCurrentSession} from './useCurrentSession';

// typage du contexte exposé par le fournisseur
export type TAuthContext = {
  connect: (data: SignInWithPasswordCredentials) => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  user: UserData | null;
  authError: string | null;
  isConnected: boolean;
};
export type UserData = User & DCP;
export type DCP = {
  nom?: string;
  prenom?: string;
  cgu_acceptees_le?: string | null;
};

// crée le contexte
export const AuthContext = createContext<TAuthContext | null>(null);

// le hook donnant accès au context
export const useAuth = () => useContext(AuthContext) as TAuthContext;

// le fournisseur de contexte
export const AuthProvider = ({children}: {children: ReactNode}) => {
  // restaure une éventuelle session précédente
  const session = useCurrentSession();
  const [user, setUser] = useState<User | null>(session?.user ?? null);

  // pour stocker la dernière erreur d'authentification
  const [authError, setAuthError] = useState<string | null>(null);

  // charge les données associées à l'utilisateur courant
  const {data: dcp} = useDCP(user?.id);
  const userData = useMemo(
    () => (user && dcp ? {...user, ...dcp} : null),
    [user, dcp]
  );

  // initialisation : enregistre l'écouteur de changements d'état
  useEffect(() => {
    // écoute les changements d'état (connecté, déconnecté, etc.)
    const {
      data: {subscription},
    } = supabaseClient.auth.onAuthStateChange(async (event, updatedSession) => {
      setUser(updatedSession?.user ?? null);
      if (updatedSession?.user) {
        setAuthError(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Initialise les données crisp.
  useEffect(() => {
    if (userData) {
      setCrispUserData(userData);

      let environment = process.env.NODE_ENV;
      if (window.location.href.includes('upcoming')) environment = 'test';
      if (window.location.href.includes('localhost'))
        environment = 'development';

      if (environment === 'production' || environment === 'test') {
        // @ts-ignore
        window.userGuiding.identify(userData.user_id, {
          Environment: environment,
          Surname: userData.nom,
          Name: userData.prenom,
          Email: userData.email,
        });
      }
    } else {
      clearCrispUserData();
    }
  }, [userData]);

  // pour authentifier l'utilisateur
  const connect = (data: SignInWithPasswordCredentials) =>
    supabaseClient.auth
      .signInWithPassword(data)
      .then(({data}) => {
        if (!data.user) {
          setAuthError("L'email et le mot de passe ne correspondent pas.");
          return false;
        }
        return true;
      })
      .catch(() => {
        return false;
      });

  // pour déconnecter l'utilisateur
  const disconnect = () =>
    supabaseClient.auth.signOut().then(response => {
      if (response.error) {
        setAuthError(response.error.message);
        return false;
      }
      return true;
    });

  // les données exposées par le fournisseur de contexte
  const isConnected = Boolean(user);
  const value = {connect, disconnect, user: userData, authError, isConnected};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

declare global {
  interface Window {
    $crisp: {
      push: (args: [action: string, method: string, value?: string[]]) => void;
    };
  }
}

// affecte les données de l'utilisateur connecté à la chatbox
const setCrispUserData = (userData: UserData | null) => {
  if ('$crisp' in window && userData) {
    const {$crisp} = window;
    const {nom, prenom, email} = userData;

    if (nom && prenom) {
      $crisp.push(['set', 'user:nickname', [`${prenom} ${nom}`]]);
    }

    // enregistre l'email
    if (email) {
      $crisp.push(['set', 'user:email', [email]]);
    }
  }
};

// ré-initialise les données de la chatbox (appelée à la déconnexion)
const clearCrispUserData = () => {
  if ('$crisp' in window) {
    const {$crisp} = window;
    $crisp.push(['do', 'session:reset']);
  }
};

// lecture des DCP
const fetchDCP = async (user_id: string) => {
  const {data} = await supabaseClient
    .from('dcp')
    .select('user_id,nom,prenom,cgu_acceptees_le')
    .match({user_id});

  return data?.length ? data[0] : null;
};

// hook qui utilise les queries DCP
export const useDCP = (user_id?: string) => {
  // fetch
  const {data} = useQuery(['dcp', user_id], () =>
    user_id ? fetchDCP(user_id) : null
  );

  return {data};
};
