import {supabaseClient} from 'core-logic/api/supabase';
import {TActionStatutsRow} from 'types/alias';
import {ActionReferentiel} from '../ReferentielTable/useReferentiel';
import {TFilters} from './filters';

// un sous-ensemble des champs pour alimenter notre table des taches
export type TacheDetail = ActionReferentiel &
  ActionStatut & {isExpanded: boolean};
export type ActionStatut = Pick<
  TActionStatutsRow,
  'action_id' | 'avancement' | 'avancement_descendants'
>;

// toutes les entrées d'un référentiel pour une collectivité et des filtres donnés
export const fetchActionStatutsList = async (
  collectivite_id: number | null,
  referentiel: string | null,
  filters: TFilters
) => {
  // la requête
  let query = supabaseClient
    .from('action_statuts')
    .select('action_id,type,avancement,avancement_descendants')
    .match({collectivite_id, referentiel, concerne: true, desactive: false})
    .gt('depth', 0);

  // construit les filtres complémentaires sauf si "tous" est inclut
  const {statut} = filters;
  if (!statut.includes('tous')) {
    // traite les autres filtres à propos de l'avancement
    const filteredDescendants = statut
      .filter(s => s !== 'non_renseigne' && s !== 'detaille')
      .join(',');
    const filteredAvancement = statut
      .filter(s => s !== 'non_renseigne' && s !== 'detaille')
      .map(s => `"${s}"`)
      .join(',');

    const or = [];

    if (statut.includes('non_renseigne')) {
      or.push(
        ...[
          // gère le cas où null veut dire "non renseigné"
          'and(type.eq.tache,or(avancement.eq.non_renseigne,avancement.is.null))',
          'and(type.eq.sous-action,and(or(avancement.eq.non_renseigne,avancement.is.null),avancement_descendants.ov.{non_renseigne}))',
          'and(type.in.(axe,sous-axe,action),avancement_descendants.ov.{non_renseigne})',
        ]
      );
    }

    if (statut.includes('detaille')) {
      or.push(
        ...[
          'and(type.eq.tache,avancement.eq.detaille)',
          'and(type.eq.sous-action,or(avancement.is.null,avancement.eq.non_renseigne),avancement_descendants.ov.{fait,programme,pas_fait,detaille})',
          'and(type.in.(axe,sous-axe,action),avancement_descendants.ov.{non_renseigne},avancement_descendants.ov.{fait,programme,pas_fait,detaille})',
        ]
      );
    }

    if (statut.filter(s => s !== 'non_renseigne' && s !== 'detaille').length) {
      or.push(
        ...[
          `and(type.eq.tache,avancement.in.(${filteredAvancement}))`,
          `and(type.eq.sous-action,avancement.in.(${filteredAvancement}))`,
          `and(type.eq.sous-action,or(avancement.eq.non_renseigne,avancement.is.null),avancement_descendants.ov.{${filteredDescendants}})`,
          `and(type.in.(axe,sous-axe,action),avancement_descendants.ov.{${filteredDescendants}})`,
        ]
      );
    }

    // ajoute les filtres complétaires à la requêtes
    query = query.or(or.join(','));
  }

  // attends les données
  const {error, data} = await query;

  if (error) {
    throw new Error(error.message);
  }

  const rows = data as TacheDetail[];

  // décompte les tâches uniquement
  const count = rows.reduce(
    (sum, {have_children}) => (have_children ? sum : sum + 1),
    0
  );
  return {rows, count};
};

// met à jour l'état d'une tâche
export const updateTacheStatut = async ({
  collectivite_id,
  action_id,
  avancement,
  avancement_detaille,
}: {
  collectivite_id: number | null;
  action_id: string;
  avancement: string;
  avancement_detaille?: number[];
}) => {
  const {error, data} = await supabaseClient.from('action_statut').upsert(
    {
      collectivite_id,
      action_id,
      avancement,
      avancement_detaille:
        avancement_detaille ||
        (avancement === 'detaille' ? [0.25, 0.5, 0.25] : undefined),
      concerne: true,
    } as never,
    {onConflict: 'collectivite_id, action_id'}
  );
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
