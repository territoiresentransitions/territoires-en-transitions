import {
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from '@material-ui/core';
import {SelectInputProps} from '@material-ui/core/Select/SelectInput';
import {useRegions} from '../useRegions';

export type TRegionFiltreProps = {
  codes: string[];
  updateCodes: (newFilters: string[]) => void;
};

/**
 * Permet de sélectionner une région
 */
export const RegionFiltre = (props: TRegionFiltreProps) => {
  const {regions} = useRegions();
  const {codes, updateCodes} = props;

  const handleChange: SelectInputProps['onChange'] = event => {
    const selection = event.target.value as string[];
    updateCodes(selection);
  };

  return (
    <FormControl>
      <InputLabel id="demo-mutiple-checkbox-label">Région {codes}</InputLabel>
      <Select
        labelId="demo-mutiple-checkbox-label"
        id="demo-mutiple-checkbox"
        multiple
        value={codes}
        onChange={handleChange}
        renderValue={selected => {
          const codes = selected as string[];
          return (
            <span>
              {regions
                .filter(r => codes.includes(r.code))
                .map(r => r.libelle)
                .join(',')}
            </span>
          );
        }}
        input={<Input />}
      >
        {regions.map(region => (
          <MenuItem key={region.code} value={region.code}>
            <Checkbox checked={codes.includes(region.code)} />
            <ListItemText primary={region.libelle} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
