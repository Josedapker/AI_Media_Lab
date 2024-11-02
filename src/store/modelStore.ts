import { create } from 'zustand';

interface ModelInfo {
  id: string;
  name: string;
  type: 'image' | 'video' | 'text';
  status: 'loaded' | 'loading' | 'error';
}

interface ModelStore {
  models: ModelInfo[];
  selectedModel: ModelInfo | null;
  updateModelStatus: (id: string, status: ModelInfo['status']) => void;
  setSelectedModel: (model: ModelInfo) => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  models: [
    {
      id: 'flux-1',
      name: 'FLUX.1 [dev]',
      type: 'image',
      status: 'loaded',
    },
    {
      id: 'svd',
      name: 'Stable Video Diffusion',
      type: 'video',
      status: 'loading',
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      type: 'text',
      status: 'loaded',
    },
  ],
  selectedModel: null,
  updateModelStatus: (id, status) =>
    set((state) => ({
      models: state.models.map((model) =>
        model.id === id ? { ...model, status } : model
      ),
    })),
  setSelectedModel: (model) => set({ selectedModel: model }),
}));