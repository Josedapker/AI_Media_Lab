import React from 'react';
import { X } from 'lucide-react';

interface MediaPreviewProps {
  file: File;
  onRemove: () => void;
}

export function MediaPreview({ file, onRemove }: MediaPreviewProps) {
  const isImage = file.type.startsWith('image/');
  const previewUrl = URL.createObjectURL(file);

  return (
    <div className="relative inline-block">
      {isImage ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="max-h-48 rounded-lg"
          onLoad={() => URL.revokeObjectURL(previewUrl)}
        />
      ) : (
        <video
          src={previewUrl}
          className="max-h-48 rounded-lg"
          controls
          onLoadedData={() => URL.revokeObjectURL(previewUrl)}
        />
      )}
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}