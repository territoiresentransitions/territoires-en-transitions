import {ChangeEvent, Fragment, useState} from 'react';
import './TagFilters.css';

type TagFiltersProps = {
  name: string;
  options: {value: string; label: string}[];
  className?: string;
  onChange: (id: string) => void;
};

const TagFilters = ({
  name,
  options,
  className = '',
  onChange,
}: TagFiltersProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('default');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className={`flex flex-wrap gap-4 ${className} tag-filters`}>
      {options.map(opt => (
        <Fragment key={opt.value}>
          <input
            className="hidden"
            type="radio"
            name={name}
            id={opt.value}
            value={opt.value}
            checked={selectedOption === opt.value}
            onChange={handleChange}
          />
          <label
            htmlFor={opt.value}
            className="block relative m-0 px-4 py-1 rounded-2xl text-sm text-bf500 bg-bf925 hover:bg-bf925hover cursor-pointer"
          >
            {opt.label}
            <span
              className="fr-fi-checkbox-circle-line scale-75 hidden"
              aria-hidden="true"
            ></span>
          </label>
        </Fragment>
      ))}
    </div>
  );
};

export default TagFilters;
