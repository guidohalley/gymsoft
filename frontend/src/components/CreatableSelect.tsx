import React from 'react';
import Creatable from 'react-select/creatable';

const CreatableSelect = ({ options, onChange, onCreateOption }) => {
    // Verificar que options es un array
    if (!Array.isArray(options)) {
        console.error("options no es un array:", options);
        return null;
    }

    return (
        <Creatable
            isClearable
            options={options}
            onChange={onChange}
            onCreateOption={onCreateOption}
        />
    );
};

export default CreatableSelect;
