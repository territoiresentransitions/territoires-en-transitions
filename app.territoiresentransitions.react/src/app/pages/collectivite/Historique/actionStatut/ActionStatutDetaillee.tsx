import ActionStatutBadge from 'ui/shared/actions/ActionStatutBadge';

export const PrecedenteActionStatutDetaille = ({
  avancementDetaille,
}: {
  avancementDetaille: number[];
}) => (
  <>
    <ActionStatutBadge statut="detaille" barre />
    <div className="mt-2">
      <p className="mb-0.5 text-sm whitespace-nowrap line-through">
        Fait: {avancementDetaille[0] * 100} %
      </p>
      <p className="mb-0.5 text-sm whitespace-nowrap line-through">
        Programmé: {avancementDetaille[1] * 100} %
      </p>
      <p className="mb-0 text-sm whitespace-nowrap line-through">
        Pas fait: {avancementDetaille[2] * 100} %
      </p>
    </div>
  </>
);

export const NouvelleActionStatutDetaille = ({
  avancementDetaille,
}: {
  avancementDetaille: number[];
}) => (
  <>
    <ActionStatutBadge statut="detaille" />
    <div className="mt-2">
      <p className="mb-0.5 text-sm whitespace-nowrap">
        Fait: {avancementDetaille[0] * 100} %
      </p>
      <p className="mb-0.5 text-sm whitespace-nowrap">
        Programmé: {avancementDetaille[1] * 100} %
      </p>
      <p className="mb-0 text-sm whitespace-nowrap">
        Pas fait: {avancementDetaille[2] * 100} %
      </p>
    </div>
  </>
);
