/**
 * Affiche l'onglet "Documentation"
 */
import DOMPurify from 'dompurify';
import {ActionDefinitionSummary} from 'core-logic/api/endpoints/ActionDefinitionSummaryReadEndpoint';
import {TPersonnalisationRegleRead} from './useRegles';
import {ActionScore} from 'types/ClientScore';
import {toLocaleFixed} from 'utils/toFixed';

export type TPersoPotentielDocProps = {
  /** Définition de l'action */
  actionDef: ActionDefinitionSummary;
  /** Détail du score associé à l'action */
  actionScore: ActionScore;
  /** Règles de personnalisation applicables */
  regles: TPersonnalisationRegleRead[];
};

export const PersoPotentielDoc = (props: TPersoPotentielDocProps) => {
  const {actionDef, actionScore, regles} = props;
  return (
    <div data-test="PersoPotentielDoc" className="p-mb-0">
      <ul>
        {regles.map(({description}, index) =>
          description ? (
            <li
              key={`r${index}`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(description),
              }}
            />
          ) : null
        )}
        <li>
          Nombre de points initial pour cette {actionDef.type} :{' '}
          {toLocaleFixed(actionScore.point_referentiel, 2)}
        </li>
      </ul>
    </div>
  );
};
