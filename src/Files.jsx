import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [data, setData] = useState(null);
  const [dragOver, setDragOver] = useState(false); // State to track whether drag over is happening

  function handleFileChange(e) {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFileName(uploadedFile.name);

    const reader = new FileReader();
    reader.onload = function (event) {
      const fileContent = event.target.result;
      const parsedData = JSON.parse(fileContent);
      emitData(parsedData);
    };

    reader.readAsText(uploadedFile);
  }

  function emitData(data) {
    // Emit an event with the loaded data
    const event = new CustomEvent('dataLoaded', { detail: data });
    window.dispatchEvent(event);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);

    const uploadedFile = e.dataTransfer.files[0];
    setFile(uploadedFile);
    setFileName(uploadedFile.name);

    const reader = new FileReader();
    reader.onload = function (event) {
      const fileContent = event.target.result;
      const parsedData = JSON.parse(fileContent);
      emitData(parsedData);
    };

    reader.readAsText(uploadedFile);
  }

  return (
    <form
      className={`form ${dragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      
    >
      <label style={{textAlign:'center'}}>Drag and Drop / Insert Here</label>
      <input
        type="file"
        className="file"
        accept="application/json"
        onChange={handleFileChange}
      />
      <p>File Name: {fileName }</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </form>
  );
}

export default App;
