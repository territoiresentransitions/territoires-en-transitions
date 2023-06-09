import {Meta} from '@storybook/react';
import {ActionProgressBar} from './ActionProgressBar';
import {makeActionScore} from 'test_utils/factories/makeActionScore';

export default {
  component: ActionProgressBar,
} as Meta;

export const ToutFait = () => (
  <ActionProgressBar
    score={makeActionScore('eci_2.1', {
      fait_taches_avancement: 1,
      pas_concerne_taches_avancement: 0,
      pas_fait_taches_avancement: 0,
      programme_taches_avancement: 0,
      point_fait: 100,
      point_potentiel: 100,
      point_pas_fait: 0,
      point_programme: 0,
    })}
  />
);

export const RienRenseigne = () => (
  <ActionProgressBar
    score={makeActionScore('eci_2.1', {
      fait_taches_avancement: 0,
      pas_concerne_taches_avancement: 0,
      pas_fait_taches_avancement: 0,
      programme_taches_avancement: 0,
      point_fait: 0,
      point_potentiel: 100,
      point_pas_fait: 0,
      point_programme: 0,
      point_non_renseigne: 100,
    })}
  />
);

export const Mixte = () => (
  <ActionProgressBar
    score={makeActionScore('eci_2.1', {
      fait_taches_avancement: 0.2,
      pas_concerne_taches_avancement: 0,
      pas_fait_taches_avancement: 0.2,
      programme_taches_avancement: 0.28,
      point_fait: 20,
      point_potentiel: 100,
      point_pas_fait: 20,
      point_programme: 28,
      point_non_renseigne: 32,
    })}
  />
);
