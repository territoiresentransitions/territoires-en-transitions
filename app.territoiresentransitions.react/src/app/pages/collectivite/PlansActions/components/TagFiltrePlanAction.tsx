import TagFilters from 'ui/shared/filters/TagFilters';
import {TOption} from 'ui/shared/select/commons';
import {useFichesNonClasseesListe} from '../FicheAction/data/useFichesNonClasseesListe';
import {usePlansActionsListe} from '../PlanAction/data/usePlansActionsListe';

/**
 * Filtres tags par plan d'action
 *
 * @param collectiviteId - (number) id de la collectivité affichée
 * @param onChangePlan - action lancée lors du changement de plan d'action
 * @param onChangeWithoutPlan - action lancée lors du toggle avec / sans plan d'action
 */

type TagFiltrePlanActionProps = {
  collectiviteId: number;
  onChangePlan: (id: number | null) => void;
  onChangeWithoutPlan: (value: boolean | null) => void;
};

const TagFiltrePlanAction = ({
  collectiviteId,
  onChangePlan,
  onChangeWithoutPlan,
}: TagFiltrePlanActionProps): JSX.Element => {
  const plansActions = usePlansActionsListe(collectiviteId);
  const fichesNonClassees = useFichesNonClasseesListe(collectiviteId);

  // Construction de la liste de filtres par plan d'action
  const filters: TOption[] = [{value: 'default', label: 'Toutes les fiches'}];

  if (plansActions?.plans && plansActions.plans.length) {
    filters.push(
      ...plansActions.plans.map(plan => ({
        value: plan.id.toString(),
        label: plan.nom && plan.nom.length > 0 ? plan.nom : 'Sans titre',
      }))
    );
  }

  if (fichesNonClassees?.fiches && fichesNonClassees.fiches.length > 0) {
    filters.push({
      value: 'nc',
      label: 'Fiches non classées',
    });
  }

  // Mise à jour des filtres sélectionnés
  const handleChangeFilter = (value: string) => {
    if (value === 'default') {
      onChangePlan(null);
      onChangeWithoutPlan(null);
    } else if (value === 'nc') {
      onChangePlan(null);
      onChangeWithoutPlan(true);
    } else {
      onChangePlan(parseInt(value));
      onChangeWithoutPlan(false);
    }
  };

  return (
    // Filtres affichés si plus d'un plan d'action défini
    filters.length > 2 ? (
      <TagFilters
        name="plans_actions"
        options={filters}
        className="pb-10"
        onChange={handleChangeFilter}
      />
    ) : (
      <></>
    )
  );
};

export default TagFiltrePlanAction;
