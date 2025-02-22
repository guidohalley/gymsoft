import React, { useState, useEffect } from 'react';
import Creatable from 'react-select/creatable';

interface CreatableSelectProps {
  isClearable?: boolean;
  placeholder?: string;
  options: Array<{ label: string; value: string | number }>;
  onChange: (newValue: any, actionMeta: any) => void;
  onCreateOption: (inputValue: string) => void;
  isLoading?: boolean;
  value?: { label: string; value: string | number } | null;
}

const CreatableSelect: React.FC<CreatableSelectProps> = ({ isClearable, placeholder, options, onChange, onCreateOption, isLoading, value }) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <Creatable
      isClearable={isClearable}
      placeholder={placeholder}
      options={options}
      onChange={(newValue, actionMeta) => {
        console.log('CreatableSelect onChange:', newValue, actionMeta);
        setInternalValue(newValue);
        onChange(newValue, actionMeta);
      }}
      onCreateOption={(inputValue) => {
        console.log('CreatableSelect onCreateOption:', inputValue);
        onCreateOption(inputValue);
      }}
      isLoading={isLoading}
      value={internalValue}
    />
  );
};

export default CreatableSelect;
