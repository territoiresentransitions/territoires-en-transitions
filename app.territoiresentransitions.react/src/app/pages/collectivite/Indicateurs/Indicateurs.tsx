import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {SwitchLabelLeft} from 'ui/shared/SwitchLabelLeft';
import {referentielToName} from 'app/labels';
import {
  indicateurViewParam,
  IndicateurViewParamOption,
  makeCollectiviteIndicateursUrl,
} from 'app/paths';
import {IndicateurPersonnaliseList} from './IndicateurPersonnaliseList';
import {ConditionnalIndicateurReferentielList} from './ConditionnalIndicateurReferentielList';
import {UiSearchBar} from 'ui/UiSearchBar';
import CollectivitePageLayout from '../CollectivitePageLayout/CollectivitePageLayout';
import {useCollectiviteId} from 'core-logic/hooks/params';
import {IndicateurPersonnaliseCreationDialog} from './IndicateurPersonnaliseCreationDialog';
import {SideNavLinks} from 'ui/shared/SideNav';

// correspondances entre item et libellé
const LABELS: Record<IndicateurViewParamOption, string> = {
  //  cle: 'Indicateurs-clé',
  //  tous: 'Tous les indicateurs',
  perso: 'Indicateurs personnalisés',
  cae: `Indicateurs ${referentielToName.cae}`,
  eci: `Indicateurs ${referentielToName.eci}`,
  crte: 'Indicateurs Contrat de relance et de transition écologique (CRTE)',
};

// items dans l'ordre de l'affichage voulu
const ITEMS: IndicateurViewParamOption[] = ['perso', 'cae', 'eci', 'crte'];

// génère les liens à afficher dans la navigation latérale
const generateIndicateursNavLinks = (collectiviteId: number): SideNavLinks => {
  return ITEMS.map(indicateurView => ({
    displayName: LABELS[indicateurView],
    link: makeCollectiviteIndicateursUrl({collectiviteId, indicateurView}),
  }));
};

const viewTitles: Record<IndicateurViewParamOption, string> = {
  perso: 'Indicateurs personnalisés',
  cae: referentielToName.cae,
  eci: referentielToName.eci,
  crte: referentielToName.crte,
};

/**
 * Display the list of indicateurs for a given view
 */
const ConditionnalIndicateurList = (props: {
  view: IndicateurViewParamOption;
  showOnlyIndicateurWithData: boolean;
  pattern: string;
}) => {
  const {view, showOnlyIndicateurWithData, pattern} = props;
  if (view === 'perso')
    return (
      <IndicateurPersonnaliseList
        showOnlyIndicateurWithData={showOnlyIndicateurWithData}
        pattern={pattern}
      />
    );
  return (
    <ConditionnalIndicateurReferentielList
      referentiel={view}
      showOnlyIndicateurWithData={showOnlyIndicateurWithData}
      pattern={pattern}
    />
  );
};

/**
 * IndicateursList show both indicateurs personnalisés and indicateurs référentiel.
 */
const Indicateurs = () => {
  const collectivite_id = useCollectiviteId();

  const {vue} = useParams<{
    [indicateurViewParam]?: IndicateurViewParamOption;
  }>();
  const current = vue || 'perso';

  const [showOnlyIndicateurWithData, setShowOnlyIndicateurWithData] =
    useState(false);
  const [pattern, setPattern] = useState('');

  return (
    <CollectivitePageLayout
      sideNav={{
        links: generateIndicateursNavLinks(collectivite_id!),
        actions: <IndicateurPersonnaliseCreationDialog />,
      }}
    >
      <div className="w-full">
        <div className="flex items-center mx-auto py-6 px-10 bg-indigo-700">
          <p className="flex grow py-2 px-3 m-0 font-bold text-white text-[2rem] leading-snug">
            {viewTitles[current]}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <SwitchLabelLeft
            id="only-filled"
            checked={showOnlyIndicateurWithData}
            className="!border-0 w-[28rem] mt-6"
            onChange={() => {
              setShowOnlyIndicateurWithData(!showOnlyIndicateurWithData);
            }}
          >
            Afficher uniquement les indicateurs renseignés
          </SwitchLabelLeft>
          <div className="w-80 fr-mr-1v">
            <UiSearchBar value={pattern} search={value => setPattern(value)} />
          </div>
        </div>
        <ConditionnalIndicateurList
          view={current}
          showOnlyIndicateurWithData={showOnlyIndicateurWithData}
          pattern={pattern}
        />
      </div>
    </CollectivitePageLayout>
  );
};

export default Indicateurs;
