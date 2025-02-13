import {supabaseClient} from 'core-logic/api/supabase';
import {useCollectiviteId, useReferentielId} from 'core-logic/hooks/params';
import {Referentiel} from 'types/litterals';
import {TAddFileFromLib} from 'ui/shared/preuves/AddPreuveModal/AddFile';
import {useAddPreuveLabellisation} from 'ui/shared/preuves/Bibliotheque/useAddPreuves';
import {TLabellisationDemande} from './types';
import {useCycleLabellisation} from './useCycleLabellisation';

type TAddDocs = () => {
  /** ajoute un fichier sélectionné depuis la bibliothèque */
  addFileFromLib: TAddFileFromLib;
};

/** Renvoie les gestionnaires d'événements du dialogue d'ajout de
 * fichiers au parcours de labellisation en cours */
export const useAddPreuveToDemande: TAddDocs = () => {
  const collectivite_id = useCollectiviteId();
  const referentiel = useReferentielId() as Referentiel;
  const {mutate: addPreuve} = useAddPreuveLabellisation();
  const {parcours} = useCycleLabellisation(referentiel);

  // associe un fichier de la bibliothèque à la demande
  const addFileFromLib: TAddFileFromLib = async fichier_id => {
    if (collectivite_id) {
      const args = {
        collectivite_id,
        commentaire: '',
        fichier_id,
      };

      const demande_id = parcours?.demande?.id;
      if (demande_id) {
        addPreuve({...args, demande_id});
      } else {
        const demande = await createDemande(collectivite_id, referentiel);
        if (demande?.id) {
          addPreuve({...args, demande_id: demande.id});
        }
      }
    }
  };
  return {
    addFileFromLib,
  };
};

// charge la demande (ou la crée) associée au parcours de labellisation d'une
// collectivité pour un référentiel et un niveau
export const createDemande = async (
  collectivite_id: number | null,
  referentiel: Referentiel | null
) => {
  if (!collectivite_id || !referentiel) {
    return null;
  }
  const {error, data} = await supabaseClient
    .rpc('labellisation_demande', {
      collectivite_id,
      referentiel,
    })
    .select();

  // cast retour de la rpc car le typage généré n'est pas bon (tableau au lieu d'élément unique)
  return error || !data ? null : (data as unknown as TLabellisationDemande);
};
