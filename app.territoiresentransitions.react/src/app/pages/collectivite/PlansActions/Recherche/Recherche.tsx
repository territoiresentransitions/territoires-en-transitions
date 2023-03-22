import {useState} from 'react';
import TagFiltrePlanAction from '../components/TagFiltrePlanAction';
import HeaderTitle from '../components/HeaderTitle';
import {useFichesActionFiltresListe} from '../FicheAction/data/useFichesActionFiltresListe';
import FicheActionCard from '../FicheAction/FicheActionCard';
import {
  makeCollectiviteFicheNonClasseeUrl,
  makeCollectivitePlanActionFicheUrl,
} from 'app/paths';
import {useFichesNonClasseesListe} from '../FicheAction/data/useFichesNonClasseesListe';
import {usePlansActionsListe} from '../PlanAction/data/usePlansActionsListe';

type RechercheProps = {
  collectiviteId: number;
};

const Recherche = ({collectiviteId}: RechercheProps): JSX.Element => {
  const [withoutPlan, setWithoutPlan] = useState<boolean | null>(null);

  const plansActions = usePlansActionsListe(collectiviteId);
  const plansArray = plansActions?.plans
    ? plansActions.plans.map(plan => plan.id)
    : [];

  const {
    items: fichesPlansActions,
    filters,
    setFilters,
  } = useFichesActionFiltresListe(plansArray);
  const fichesNonClassees = useFichesNonClasseesListe(collectiviteId);

  return (
    <div className="w-full">
      <HeaderTitle type="plan" titre="Rechercher une fiche" isReadonly={true} />
      <div className="max-w-4xl mx-auto px-10">
        {/* Filtres par mots clefs */}
        {/* <div className="fr-search-bar pt-10" role="search">
          <input
            className="fr-input"
            placeholder="Rechercher par mot-clé, thématique, personne ou structure pilote, partenaire, financeur, etc."
            type="search"
            id="search-784-input"
            name="search-784-input"
          />
          <button className="fr-btn" title="Rechercher">
            Rechercher
          </button>
        </div> */}

        {/* Filtres par plan d'actions */}
        <TagFiltrePlanAction
          collectiviteId={collectiviteId}
          onChangePlan={id => {
            setFilters({...filters, axes_id: id ? [id] : plansArray});
            setWithoutPlan(id ? true : false);
          }}
          onChangeWithoutPlan={setWithoutPlan}
        />

        {/* Fiches filtrées */}
        <div className="grid gap-4">
          {/* Fiches avec plan d'action */}
          {!withoutPlan &&
            fichesPlansActions.map(fiche => (
              <FicheActionCard
                key={fiche.id}
                ficheAction={fiche}
                link={makeCollectivitePlanActionFicheUrl({
                  collectiviteId: collectiviteId,
                  planActionUid: '',
                  ficheUid: fiche.id!.toString(),
                })}
              />
            ))}
          {/* Fiches sans plan d'action */}
          {(filters.axes_id.length > 1 || filters.axes_id.length === 0) &&
            !!fichesNonClassees &&
            fichesNonClassees.fiches.map(fiche => (
              <FicheActionCard
                key={fiche.id}
                ficheAction={fiche}
                link={makeCollectiviteFicheNonClasseeUrl({
                  collectiviteId: collectiviteId,
                  ficheUid: fiche.id!.toString(),
                })}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Recherche;
