import {useQuery} from 'react-query';

import {supabaseClient} from 'core-logic/api/supabase';
import {TFilArianeLink} from 'ui/shared/FilAriane';
import {
  makeCollectivitePlanActionAxeUrl,
  makeCollectivitePlanActionUrl,
} from 'app/paths';
import {TAxeRow} from 'types/alias';
import {generateTitle} from '../../FicheAction/data/utils';

type FilArianeArgs = {
  collectiviteId: number;
  chemin: TAxeRow[];
  titreFiche: string;
  noLinks?: boolean;
};

export const generateFilArianeLinks = ({
  collectiviteId,
  chemin,
  titreFiche,
  noLinks,
}: FilArianeArgs): TFilArianeLink[] => {
  return [
    ...chemin.map((axe, i) => {
      // Lien plan d'action
      if (i === 0) {
        return {
          displayedName: generateTitle(axe.nom),
          path: !noLinks
            ? makeCollectivitePlanActionUrl({
                collectiviteId,
                planActionUid: chemin[0].id.toString(),
              })
            : undefined,
        };
      }
      // Lien axe niveau 1
      if (i === 1) {
        return {
          displayedName: generateTitle(axe.nom),
          path: !noLinks
            ? makeCollectivitePlanActionAxeUrl({
                collectiviteId,
                planActionUid: chemin[0].id.toString(),
                axeUid: axe.id.toString(),
              })
            : undefined,
        };
      }
      // Autres axes
      return {
        displayedName: generateTitle(axe.nom),
      };
    }),
    {displayedName: generateTitle(titreFiche)},
  ];
};

/**
 * Récupère les parents d'un axe dans un plan.
 * Renvoi l'id du plan et l'id de la collectivité
 * ainsi que le chemin jusqu'à l'axe donné.
 */
export const usePlanActionChemin = (axe_id: number) => {
  return useQuery(['plan_action_chemin', axe_id], async () => {
    const {data} = await supabaseClient
      .from('plan_action_chemin')
      .select()
      .eq('axe_id', axe_id);
    return data && data[0];
  });
};
