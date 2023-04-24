import {useCollectiviteId} from 'core-logic/hooks/params';
import {TAddFileFromLib} from 'ui/shared/preuves/AddPreuveModal/AddFile';
import {TAddLink} from 'ui/shared/preuves/AddPreuveModal/AddLink';
import {useAddPreuveAnnexe} from 'ui/shared/preuves/Bibliotheque/useAddPreuves';

type TAddDocs = (demande_id: number) => {
  /** ajoute un fichier sélectionné depuis la bibliothèque */
  addFileFromLib: TAddFileFromLib;
};

/** Renvoie les gestionnaires d'événements du dialogue d'ajout de
 * fichiers/liens à une fiche action */
export const useAddAnnexe: TAddDocs = (fiche_id: number) => {
  const collectivite_id = useCollectiviteId();
  const {mutate: addPreuve} = useAddPreuveAnnexe();

  // associe un fichier de la bibliothèque à l'audit
  const addFileFromLib: TAddFileFromLib = fichier_id => {
    if (collectivite_id) {
      addPreuve({
        fiche_id,
        collectivite_id,
        commentaire: '',
        fichier_id,
      });
    }
  };

  const addLink: TAddLink = (titre, url) => {
    if (collectivite_id) {
      addPreuve({
        fiche_id,
        collectivite_id,
        commentaire: '',
        titre,
        url,
      });
    }
  };

  return {
    addFileFromLib,
    addLink,
  };
};
