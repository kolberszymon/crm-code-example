import React from 'react';
import CreatableSelect from 'react-select/creatable';

const CreatableSearchBar = ({ options, defaultValue, onChange, placeholder, onCreateOption }) => (
  <CreatableSelect
    defaultValue={defaultValue}
    options={Array.isArray(options) ? options : []}
    onChange={onChange}
    onCreateOption={onCreateOption}
    placeholder={placeholder}
    formatCreateLabel={(inputValue) => `Stwórz "${inputValue}"`}
    noOptionsMessage={() => "Brak kategorii"}
    classNames={{
      control: ({isFocused}) => `border border-gray-300 rounded-md shadow-sm text-xs ${isFocused ? 'border-main-green' : ''}`,
      option: ({ isFocused, isSelected }) =>
        `${isFocused ? 'bg-gray-100' : ''} ${isSelected ? 'bg-primary-green text-white' : ''} text-xs`,
      menu: () => "mt-1 bg-white rounded-md shadow-lg",
    }}
    styles={{
      control: (base) => ({
        ...base,
        '&:hover': { borderColor: '#015640' },
        '&:focus': { borderColor: '#015640' },
      }),
      option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected ? '#2563eb' : isFocused ? '#e5e7eb' : undefined,
        color: isSelected ? 'white' : 'black',
        fontSize: '12px',
      }),
    }}
  />
);

export default CreatableSearchBar;