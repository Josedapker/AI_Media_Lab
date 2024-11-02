import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, Download, Sparkles } from 'lucide-react';
import type { GeneratedMedia } from '../types';
import { useMediaStore } from '../store/mediaStore';
import { generateMedia } from '../lib/api';

interface DraggableMediaProps {
  item: GeneratedMedia;
}

export function DraggableMedia({ item }: DraggableMediaProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const { toggleMediaSelection, selectedMediaIds, addVariation } = useMediaStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDownload = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${prompt.slice(0, 30)}.${url.endsWith('.mp4') ? 'mp4' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleCreateVariation = async (mediaId: string, prompt: string) => {
    try {
      const result = await generateMedia({
        type: 'image',
        prompt,
      });
      addVariation(mediaId, result.url);
    } catch (error) {
      console.error('Variation generation failed:', error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl shadow-lg overflow-hidden group ${
        selectedMediaIds.includes(item.id) ? 'ring-2 ring-purple-500' : ''
      }`}
      onClick={() => toggleMediaSelection(item.id)}
      {...attributes}
      {...listeners}
    >
      <div className="relative aspect-square">
        {item.type === 'video' ? (
          <video
            src={item.url}
            className="w-full h-full object-cover"
            controls
          />
        ) : (
          <img
            src={item.url}
            alt={item.prompt}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(item.url, item.prompt);
            }}
            className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Download className="w-6 h-6" />
          </button>
          {item.type === 'image' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCreateVariation(item.id, item.prompt);
              }}
              className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Sparkles className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {item.prompt}
        </p>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        
        {item.variations && item.variations.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {item.variations.map((variationUrl, index) => (
              <img
                key={index}
                src={variationUrl}
                alt={`Variation ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}