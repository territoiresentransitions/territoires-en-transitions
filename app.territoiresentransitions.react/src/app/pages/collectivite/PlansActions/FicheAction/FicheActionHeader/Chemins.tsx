import {Link} from 'react-router-dom';

import FilAriane from 'ui/shared/FilAriane';
import {makeCollectiviteFichesNonClasseesUrl} from 'app/paths';
import {FicheAction} from '../data/types';
import {
  generateFilArianeLinks,
  usePlanActionChemin,
} from '../../PlanAction/data/usePlanActionChemin';
import {TAxeInsert, TAxeRow} from 'types/alias';
import {useState} from 'react';
import classNames from 'classnames';
import {generateTitle} from '../data/utils';

type Props = {
  fiche: FicheAction;
};

const Chemins = ({fiche}: Props) => {
  return (
    <div data-test="FicheFilAriane" className="flex items-center">
      {!fiche.axes || fiche.axes.length === 0 ? (
        <Link
          className="p-1 text-xs text-gray-500 underline !bg-none !shadow-none hover:text-gray-600"
          to={() =>
            makeCollectiviteFichesNonClasseesUrl({
              collectiviteId: fiche.collectivite_id!,
            })
          }
        >
          Fiches non classées
        </Link>
      ) : fiche.axes.length === 1 ? (
        <Chemin
          collectiviteId={fiche.collectivite_id!}
          axe_id={fiche.axes[0].id!}
          titreFiche={generateTitle(fiche.titre)}
        />
      ) : (
        <CheminPlusieursPlans
          collectiviteId={fiche.collectivite_id!}
          axes={fiche.axes}
          titreFiche={generateTitle(fiche.titre)}
        />
      )}
    </div>
  );
};

export default Chemins;

type CheminProps = {
  collectiviteId: number;
  axe_id: number;
  titreFiche: string;
};

/** Affiche un fil d'ariane avec le chemin jusqu'à la racine du plan */
const Chemin = ({collectiviteId, axe_id, titreFiche}: CheminProps) => {
  const {data} = usePlanActionChemin(axe_id);

  return (
    <FilAriane
      links={
        data
          ? generateFilArianeLinks({
              collectiviteId,
              chemin: data.chemin as TAxeRow[],
              titreFiche: generateTitle(titreFiche),
            })
          : []
      }
    />
  );
};

type CheminPlusieursPlansProps = {
  collectiviteId: number;
  axes: TAxeInsert[];
  titreFiche: string;
};

/** Cache les différents fils d'ariane derrière un toggle */
const CheminPlusieursPlans = ({
  collectiviteId,
  axes,
  titreFiche,
}: CheminPlusieursPlansProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="flex items-center p-1 text-gray-500 hover:text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="underline text-xs">
          Voir tous les emplacements pour cette fiche
        </span>

        <div
          className={classNames('fr-fi-arrow-down-s-line mt-1 ml-1 scale-75', {
            'rotate-180': isOpen,
          })}
        />
      </button>
      {isOpen && (
        <div className="flex flex-col gap-4 mt-4">
          {axes.map((axe: TAxeInsert) => (
            <Chemin
              key={axe.id}
              collectiviteId={collectiviteId}
              axe_id={axe.id!}
              titreFiche={generateTitle(titreFiche)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
