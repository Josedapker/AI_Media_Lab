import { create } from 'zustand';
import type { GeneratedMedia, GenerationType, MediaFolder } from '../types';
import { generateInitialMedia } from '../lib/api';

interface MediaStore {
  media: GeneratedMedia[];
  folders: MediaFolder[];
  activeType: GenerationType;
  activeFolder: string | null;
  selectedMediaIds: string[];
  setActiveType: (type: GenerationType) => void;
  setActiveFolder: (id: string | null) => void;
  addMedia: (media: GeneratedMedia) => void;
  removeMedia: (ids: string[]) => void;
  addFolder: (name: string) => void;
  removeFolder: (id: string) => void;
  moveToFolder: (mediaIds: string[], folderId: string | null) => void;
  toggleMediaSelection: (id: string) => void;
  clearSelection: () => void;
  addVariation: (mediaId: string, variationUrl: string) => void;
  reorderMedia: (activeId: string, overId: string) => void;
}

// Initialize with demo content
const initialMedia = generateInitialMedia(8);
const initialFolders: MediaFolder[] = [
  {
    id: 'landscapes',
    name: 'Landscapes',
    createdAt: new Date().toISOString(),
    mediaIds: [initialMedia[0].id, initialMedia[1].id],
  },
  {
    id: 'portraits',
    name: 'Portraits',
    createdAt: new Date().toISOString(),
    mediaIds: [initialMedia[2].id],
  },
];

// Assign some media to folders
const mediaWithFolders = initialMedia.map((item, index) => ({
  ...item,
  folderId: index < 2 ? 'landscapes' : index === 2 ? 'portraits' : undefined,
}));

export const useMediaStore = create<MediaStore>((set) => ({
  media: mediaWithFolders,
  folders: initialFolders,
  activeType: 'image',
  activeFolder: null,
  selectedMediaIds: [],
  
  setActiveType: (type) => set({ activeType: type }),
  setActiveFolder: (id) => set({ activeFolder: id }),
  
  addMedia: (media) => set((state) => ({ 
    media: [media, ...state.media] 
  })),
  
  removeMedia: (ids) => set((state) => ({ 
    media: state.media.filter((item) => !ids.includes(item.id)),
    selectedMediaIds: state.selectedMediaIds.filter((id) => !ids.includes(id)),
  })),
  
  addFolder: (name) => set((state) => ({
    folders: [{
      id: Math.random().toString(36).substring(7),
      name,
      createdAt: new Date().toISOString(),
      mediaIds: [],
    }, ...state.folders],
  })),
  
  removeFolder: (id) => set((state) => ({
    folders: state.folders.filter((folder) => folder.id !== id),
    media: state.media.map((item) => 
      item.folderId === id ? { ...item, folderId: undefined } : item
    ),
    activeFolder: state.activeFolder === id ? null : state.activeFolder,
  })),
  
  moveToFolder: (mediaIds, folderId) => set((state) => ({
    media: state.media.map((item) =>
      mediaIds.includes(item.id) ? { ...item, folderId } : item
    ),
    selectedMediaIds: [],
  })),
  
  toggleMediaSelection: (id) => set((state) => ({
    selectedMediaIds: state.selectedMediaIds.includes(id)
      ? state.selectedMediaIds.filter((mediaId) => mediaId !== id)
      : [...state.selectedMediaIds, id],
  })),
  
  clearSelection: () => set({ selectedMediaIds: [] }),
  
  addVariation: (mediaId, variationUrl) => set((state) => ({
    media: state.media.map((item) =>
      item.id === mediaId
        ? {
            ...item,
            variations: [...(item.variations || []), variationUrl],
          }
        : item
    ),
  })),

  reorderMedia: (activeId, overId) => set((state) => {
    const oldIndex = state.media.findIndex((item) => item.id === activeId);
    const newIndex = state.media.findIndex((item) => item.id === overId);

    const newMedia = [...state.media];
    const [movedItem] = newMedia.splice(oldIndex, 1);
    newMedia.splice(newIndex, 0, movedItem);

    return { media: newMedia };
  }),
}));