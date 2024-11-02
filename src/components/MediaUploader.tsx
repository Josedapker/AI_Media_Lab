import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface MediaUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function MediaUploader({ files, onChange }: MediaUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov'],
    },
    maxFiles: 4,
    onDrop: (acceptedFiles) => {
      onChange([...files, ...acceptedFiles].slice(0, 4));
    },
  });

  const removeMedia = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer',
          isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-500'
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <ImageIcon className="w-6 h-6 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive ? 'Drop media here' : 'Drag & drop media, or click to select'}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative aspect-square">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <video
                  src={URL.createObjectURL(file)}
                  className="w-full h-full object-cover rounded-lg"
                  controls
                />
              )}
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}