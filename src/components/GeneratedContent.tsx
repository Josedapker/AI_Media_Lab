import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Expand, Sparkles } from 'lucide-react';
import { useMediaStore } from '../store/mediaStore';
import { GeneratedMedia } from '../types';
import clsx from 'clsx';

interface GenerationGroupProps {
  prompt: string;
  items: GeneratedMedia[];
  timestamp: string;
}

function GenerationGroup({ prompt, items, timestamp }: GenerationGroupProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const previousImage = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const activeItem = items[activeIndex];

  const handleDownload = async () => {
    try {
      const response = await fetch(activeItem.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${prompt.slice(0, 30)}.${activeItem.type === 'video' ? 'mp4' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 line-clamp-2 flex-1 mr-4">{prompt}</p>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {new Date(timestamp).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      <div className="relative group">
        <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
          {activeItem.type === 'video' ? (
            <video
              src={activeItem.url}
              className="w-full h-full object-contain"
              controls
            />
          ) : (
            <img
              src={activeItem.url}
              alt={activeItem.prompt}
              className={clsx(
                'w-full h-full object-contain transition-all duration-300',
                isExpanded ? 'cursor-zoom-out scale-105' : 'cursor-zoom-in hover:scale-105'
              )}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}
        </div>

        {items.length > 1 && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={clsx(
                'w-2 h-2 rounded-full transition-all duration-300 transform',
                index === activeIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              )}
            />
          ))}
        </div>
      </div>

      <div className="p-4 flex items-center justify-between border-t bg-gray-50">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={clsx(
                'relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-300',
                index === activeIndex && 'ring-2 ring-purple-500'
              )}
            >
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Variation ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              {index === activeIndex && (
                <div className="absolute inset-0 bg-purple-500/10" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          {activeItem.type === 'image' && (
            <button
              onClick={() => {}} // TODO: Implement create variation
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Create Variation"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            title="Expand"
          >
            <Expand className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-zoom-out"
          onClick={() => setIsExpanded(false)}
        >
          <img
            src={activeItem.url}
            alt={activeItem.prompt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}

export function GeneratedContent() {
  const { media } = useMediaStore();

  // Group media by prompt and timestamp
  const groups = media.reduce((acc, item) => {
    const key = `${item.prompt}-${new Date(item.createdAt).toDateString()}`;
    if (!acc[key]) {
      acc[key] = {
        prompt: item.prompt,
        items: [],
        timestamp: item.createdAt,
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, GenerationGroupProps>);

  return (
    <div className="space-y-6 p-4">
      {Object.values(groups)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .map((group, index) => (
          <GenerationGroup key={index} {...group} />
        ))}
    </div>
  );
}