'use client';

import { useState } from 'react';

export default function DragDropUpload() {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        className="w-96 h-48 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-white"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          className="hidden"
          id="fileInput"
          onChange={handleFileSelect}
        />
        <label htmlFor="fileInput" className="text-gray-600 text-center px-4">
          Drag & Drop files here or <span className="text-blue-500 underline">browse</span>
        </label>
      </div>
      <ul className="mt-4 w-96 text-sm text-gray-700">
        {files.map((file, index) => (
          <li key={index} className="border-b py-1">
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
