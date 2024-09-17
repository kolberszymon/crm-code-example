import React from 'react';
import Select from 'react-select';

const SelectSearchBar = ({ options, defaultValue, onChange, placeholder }) => (
  <Select
    defaultValue={defaultValue}
    options={options}
    onChange={onChange}
    placeholder={placeholder}
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

export default SelectSearchBar;