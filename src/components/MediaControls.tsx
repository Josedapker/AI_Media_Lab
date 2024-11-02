import React from 'react';
import { Image as ImageIcon, Video, Upload, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

interface MediaControlsProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function MediaControls({ files, onChange }: MediaControlsProps) {
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
    <div className="space-y-2">
      <div className="flex space-x-2">
        <button
          type="button"
          {...getRootProps()}
          className={clsx(
            'flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border-2 border-dashed transition-colors',
            isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-500'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Add media</span>
        </button>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
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
                />
              )}
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <Trash2 className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}