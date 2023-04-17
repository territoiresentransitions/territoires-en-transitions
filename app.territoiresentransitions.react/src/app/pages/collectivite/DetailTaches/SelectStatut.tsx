import SelectDropdown from 'ui/shared/select/SelectDropdown';
import ActionStatutBadge from 'ui/shared/actions/ActionStatutBadge';
import {ActionAvancement} from 'generated/dataLayer/action_statut_read';
import {useEditActionStatutIsDisabled} from 'core-logic/hooks/useActionStatut';
import {avancementToLabel} from 'app/labels';

export type TSelectStatutProps = {
  className?: string;
  value: string;
  onChange: (value: string) => void;
};

export const ITEMS: {value: ActionAvancement; label: string}[] = (
  [
    'non_renseigne',
    'pas_fait',
    'programme',
    'detaille',
    'fait',
  ] as ActionAvancement[]
).map(value => ({value, label: avancementToLabel[value]}));

/**
 * Affiche le filtre par statuts
 */
const SelectStatutBase = (props: TSelectStatutProps & {disabled?: boolean}) => {
  const {value, onChange, disabled} = props;

  return disabled ? (
    <ActionStatutBadge
      statut={value as ActionAvancement}
      small
      className="mr-auto"
    />
  ) : (
    <SelectDropdown
      data-test="SelectStatut"
      value={value}
      options={ITEMS}
      onSelect={onChange}
      buttonClassName="px-2 py-1"
      renderOption={option => (
        <ActionStatutBadge statut={option.value as ActionAvancement} small />
      )}
      renderSelection={value => (
        <ActionStatutBadge
          statut={value as ActionAvancement}
          small
          className="mr-auto"
        />
      )}
    />
  );
};

export const SelectStatut = (
  props: TSelectStatutProps & {action_id: string}
) => {
  const {action_id} = props;
  const isDisabled = useEditActionStatutIsDisabled(action_id);

  return <SelectStatutBase disabled={isDisabled} {...props} />;
};
