-- Deploy tet:referentiel/vue_tabulaire to pg
-- requires: referentiel/contenu
-- requires: referentiel/action_statut
-- requires: evaluation/score_summary

BEGIN;

drop view action_statuts;
create view action_statuts
as
select -- Le client filtre sur:
       c.id                                               as collectivite_id,
       d.action_id,
       client_scores.referentiel,
       d.type,
       d.descendants,
       d.ascendants,
       d.depth,
       d.have_children,

       -- et éventuellement sélectionne:
       d.identifiant,
       d.nom,
       d.description,
       d.have_exemples,
       d.have_preuve,
       d.have_ressources,
       d.have_reduction_potentiel,
       d.have_perimetre_evaluation,
       d.have_contexte,
       d.phase,

       -- les scores [0.0, 1.0]
       sc.score_realise,
       sc.score_programme,
       sc.score_realise_plus_programme,
       sc.score_pas_fait,
       sc.score_non_renseigne,

       -- les points
       sc.points_restants,
       sc.points_realises,
       sc.points_programmes,
       sc.points_max_personnalises,
       sc.points_max_referentiel,

       -- les flags
       sc.concerne,
       sc.desactive,

       -- les statuts saisis
       s.avancement,
       s.avancement_detaille,

       -- les statuts des enfants
       cs.avancements                                     as avancement_descendants,
       coalesce((not s.concerne), cs.non_concerne, false) as non_concerne

-- pour chaque collectivité
from collectivite c
         -- on prend les scores au format json pour chaque référentiel
         join client_scores on client_scores.collectivite_id = c.id
    -- que l'on explose en lignes, une par action
         join private.convert_client_scores(client_scores.scores) ccc on true
    -- puis on converti chacune de ces lignes au format approprié pour les vues tabulaires du client
         join private.to_tabular_score(ccc) sc on true
    -- on y join la définition de l'action
         join action_referentiel d on sc.action_id = d.action_id
    -- et les statuts saisis si ils existent (left join)
         left join action_statut s on c.id = s.collectivite_id and s.action_id = d.action_id
    -- pour chacune de ces lignes on agrège les avancements des descendants, afin de pouvoir les filtrer
         left join lateral (
    select case
               -- aucun descendant
               when not d.have_children then
                   '{}'::avancement[]
               -- aucun statut pour les enfants
               when ccc.point_non_renseigne = ccc.point_potentiel then
                   '{non_renseigne}'::avancement[]
               -- des statuts mais pas pour chaque enfant
               when ccc.point_non_renseigne > 0.0 then
                       '{non_renseigne}'::avancement[] ||
                       array_agg(distinct statut.avancement) filter ( where statut.concerne )
               -- des statuts pour chaque enfant
               else
                   array_agg(distinct statut.avancement) filter ( where statut.concerne )
               end
               as avancements,
           not bool_and(statut.concerne)
               as non_concerne
    from action_statut statut
    where c.id = statut.collectivite_id
      and statut.action_id = any (d.leaves)
    ) cs on true
order by c.id,
         naturalsort(d.identifiant);

COMMIT;
