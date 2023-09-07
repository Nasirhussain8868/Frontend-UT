"use client"
import { useFormik } from 'formik';
import React from 'react'
import { useState } from 'react';

const Drag = () => {
    const [selectedData, setSelectedData] = useState([]);

    const formik = useFormik({
      initialValues: {
        selectedValues: '',
      },
      onSubmit: (values) => {
        // Handle the selected data here, you can send it to your API or do something else with it.
        console.log('Selected Data:', selectedData.toString().replace(/ /g, ','));
        const cArray = selectedData.toString().replace(/ /g, ',');
        console.log(cArray.split(","));
      },
    });
  
    const handleMouseDown = (e) => {
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        // Add the selected text to the list of selected data
        setSelectedData([...selectedData, selectedText]);
      }
    };
  
    return (
      <div>
        <div
          onMouseDown={handleMouseDown}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            minHeight: '100px',
          }}
          suppressContentEditableWarning={true}
        >
          data1 data2 data3 data4
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div>
            Selected Data: {selectedData.toString().replace(/ /g, ',')}
            <input
              type="hidden"
              name="selectedValues"
              value={selectedData}
              onChange={formik.handleChange}
            />
            
          </div>
          <button type="submit">Select Data</button>
        </form>
      </div>
    )
}

export default Drag