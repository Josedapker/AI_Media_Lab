import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import clsx from 'clsx';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export function FileUpload({ onUpload, accept, maxSize = 5242880 }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > maxSize) {
        setError('File is too large');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUpload(file);
      setError(null);
    }
  }, [maxSize, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-4 transition-colors text-center',
          isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300',
          preview ? 'border-solid' : 'hover:border-purple-500 hover:bg-purple-50'
        )}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
              }}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Drop the file here'
                : 'Drag & drop a file here, or click to select'}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}