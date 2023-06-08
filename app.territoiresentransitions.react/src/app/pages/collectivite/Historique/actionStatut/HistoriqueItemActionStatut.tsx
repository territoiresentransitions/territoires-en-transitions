import {
  DetailNouvelleModificationWrapper,
  DetailPrecedenteModificationWrapper,
} from 'app/pages/collectivite/Historique/DetailModificationWrapper';
import ActionStatutBadge from 'ui/shared/actions/ActionStatutBadge';
import Modification from 'app/pages/collectivite/Historique/Modification';
import {
  NouvelleActionStatutDetaille,
  PrecedenteActionStatutDetaille,
} from 'app/pages/collectivite/Historique/actionStatut/ActionStatutDetaillee';
import {THistoriqueItemProps} from '../types';
import {getItemActionProps} from './getItemActionProps';

const HistoriqueItemActionStatut = (props: THistoriqueItemProps) => {
  const {item} = props;

  return (
    <Modification
      historique={item}
      icon="fr-fi-information-fill"
      nom="Action : statut modifié"
      detail={<HistoriqueItemActionStatutDetails {...props} />}
      {...getItemActionProps(item)}
    />
  );
};

export default HistoriqueItemActionStatut;

const HistoriqueItemActionStatutDetails = (props: THistoriqueItemProps) => {
  const {item} = props;
  const {
    previous_avancement,
    previous_avancement_detaille,
    avancement,
    avancement_detaille,
  } = item;

  return (
    <>
      {previous_avancement !== null ? (
        <DetailPrecedenteModificationWrapper>
          {previous_avancement === 'detaille' &&
          previous_avancement_detaille ? (
            <PrecedenteActionStatutDetaille
              avancementDetaille={previous_avancement_detaille}
            />
          ) : (
            <ActionStatutBadge statut={previous_avancement} barre />
          )}
        </DetailPrecedenteModificationWrapper>
      ) : null}
      <DetailNouvelleModificationWrapper>
        {avancement === 'detaille' && avancement_detaille ? (
          <NouvelleActionStatutDetaille
            avancementDetaille={avancement_detaille}
          />
        ) : (
          <ActionStatutBadge statut={avancement ?? 'non_renseigne'} />
        )}
      </DetailNouvelleModificationWrapper>
    </>
  );
};
