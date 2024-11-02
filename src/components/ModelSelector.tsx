import React from 'react';
import { Brain } from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video';
}

const textModels: ModelOption[] = [
  { id: 'gpt4', name: 'GPT-4', type: 'text' },
  { id: 'gpt4-mini', name: 'GPT-4 Mini', type: 'text' },
  { id: 'claude-o1', name: 'Claude O1', type: 'text' },
  { id: 'claude-o1-mini', name: 'Claude O1 Mini', type: 'text' },
  { id: 'claude-o1-preview', name: 'Claude O1 Preview', type: 'text' },
  { id: 'grok', name: 'Grok', type: 'text' },
  { id: 'llama3', name: 'Llama 3', type: 'text' },
];

const imageModels: ModelOption[] = [
  { id: 'flux', name: 'Flux', type: 'image' },
  { id: 'sdxl', name: 'Stable Diffusion', type: 'image' },
  { id: 'pixelartxl', name: 'PixelArtXL', type: 'image' },
];

const videoModels: ModelOption[] = [
  { id: 'luma', name: 'Luma Labs', type: 'video' },
  { id: 'runway', name: 'Runway Gen-2', type: 'video' },
  { id: 'kling', name: 'Kling', type: 'video' },
];

interface ModelSelectorProps {
  type: 'text' | 'image' | 'video';
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ type, value, onChange }: ModelSelectorProps) {
  const models = type === 'text' ? textModels : type === 'image' ? imageModels : videoModels;

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
        <Brain className="w-4 h-4" />
        <span>Model</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
      >
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}