import { ErrorMessage, useFormikContext } from 'formik';
import React, { useState } from 'react'
import Select from 'react-select'

const Selects = ({ options,name,label ,defaults,disabled}) => {
    const [selectedOption, setSelectedOption] = useState(defaults);
    const formik = useFormikContext();
    const handleTypeSelect = e => {
        setSelectedOption(e.value);
        formik.setFieldValue(name, e.value);
      };
    return (
        <div>
         <label className={`block py-2 text-base lg:text-base font-medium text-gray-900`}>{label}</label>
            <Select
                id={name}
                name={name}
                isDisabled={disabled === 'disable' ? true : false }
                options={options}
                value={options.filter(function (option) {
                    return option.value === selectedOption;
                })}
                onChange={handleTypeSelect}
            />
            <ErrorMessage name={name} className='mt-1 text-red-700' component="div" />

        </div>
    )
}

export default Selects