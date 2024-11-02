import React from 'react';
import { Palette } from 'lucide-react';

interface LoRAOption {
  id: string;
  name: string;
  category: 'character' | 'style' | 'effect';
}

const loras: LoRAOption[] = [
  { id: 'anime', name: 'Anime Style', category: 'character' },
  { id: 'realistic', name: 'Realistic Portrait', category: 'character' },
  { id: 'watercolor', name: 'Watercolor', category: 'style' },
  { id: 'oil', name: 'Oil Painting', category: 'style' },
  { id: 'neon', name: 'Neon Glow', category: 'effect' },
  { id: 'cinematic', name: 'Cinematic', category: 'effect' },
];

interface LoRASelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LoRASelector({ value, onChange }: LoRASelectorProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
        <Palette className="w-4 h-4" />
        <span>LoRA Style</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
      >
        <option value="">No LoRA</option>
        <optgroup label="Character">
          {loras.filter(l => l.category === 'character').map(lora => (
            <option key={lora.id} value={lora.id}>
              {lora.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Style">
          {loras.filter(l => l.category === 'style').map(lora => (
            <option key={lora.id} value={lora.id}>
              {lora.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Effects">
          {loras.filter(l => l.category === 'effect').map(lora => (
            <option key={lora.id} value={lora.id}>
              {lora.name}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}