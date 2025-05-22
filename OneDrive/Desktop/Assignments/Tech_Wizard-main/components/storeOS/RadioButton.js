import React from 'react'

const RadioButton = ({ options, selectedOption, onChange, name }) => {
    return (
        <div className="flex flex-col space-y-2">
            {options.map((option) => (
                <label
                    key={option.value}
                    className="flex items-center space-x-3 text-sm text-neutral-900"
                >
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={selectedOption === option.value}
                        onChange={() => onChange(option.value)}
                        className="form-radio text-primary-500 focus:ring-primary-500"
                    />
                    <span>{option.label}</span>
                </label>
            ))}
        </div>
    )
}

export default RadioButton
