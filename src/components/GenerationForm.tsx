import React, { useState } from 'react';
import { ImageIcon, Video, Wand2, Loader } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ModelSelector } from './ModelSelector';
import { LoRASelector } from './LoRASelector';
import { MediaPreview } from './MediaPreview';
import { useGeneration } from '../hooks/useGeneration';
import clsx from 'clsx';

export function GenerationForm() {
  const [activeType, setActiveType] = useState<'image' | 'video'>('image');
  const [generationType, setGenerationType] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux');
  const [loraStyle, setLoraStyle] = useState('none');
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  
  const { generate, isGenerating, progress } = useGeneration();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'video/*': generationType === 'video' ? ['.mp4', '.mov'] : [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setSourceImage(acceptedFiles[0]);
      setGenerationType('image');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      await generate({
        type: activeType,
        prompt: prompt.trim(),
        sourceImage: sourceImage ? URL.createObjectURL(sourceImage) : undefined,
      });
      
      setPrompt('');
      setSourceImage(null);
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">AI Media Generation</h2>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
          <button
            type="button"
            onClick={() => setActiveType('image')}
            className={clsx(
              'flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors',
              activeType === 'image' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-200'
            )}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('video')}
            className={clsx(
              'flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors',
              activeType === 'video' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-200'
            )}
          >
            <Video className="w-4 h-4" />
            <span>Video</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
          <button
            type="button"
            onClick={() => setGenerationType('text')}
            className={clsx(
              'flex items-center px-3 py-1.5 rounded-lg transition-colors',
              generationType === 'text' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-200'
            )}
          >
            <span>{activeType === 'video' ? 'Text to Video' : 'Text to Image'}</span>
          </button>
          <button
            type="button"
            onClick={() => setGenerationType('image')}
            className={clsx(
              'flex items-center px-3 py-1.5 rounded-lg transition-colors',
              generationType === 'image' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-200'
            )}
          >
            <span>{activeType === 'video' ? 'Image to Video' : 'Image to Image'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <ModelSelector type={activeType} value={model} onChange={setModel} />
          <LoRASelector value={loraStyle} onChange={setLoraStyle} />
        </div>

        {generationType === 'image' && (
          <div
            {...getRootProps()}
            className={clsx(
              'border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer text-center',
              isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-500'
            )}
          >
            <input {...getInputProps()} />
            {sourceImage ? (
              <MediaPreview file={sourceImage} onRemove={() => setSourceImage(null)} />
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-600">
                  {isDragActive ? 'Drop your image here' : 'Drag & drop or click to upload source image'}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 min-h-[100px] resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {}}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
          >
            <span>Advanced Options</span>
          </button>
          
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Generating... {progress}%</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}