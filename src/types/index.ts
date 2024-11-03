export type GenerationType = 'image' | 'video';
export type VideoGenerationType = 'text-to-video' | 'image-to-video';

export interface GenerationRequest {
  prompt: string;
  type: GenerationType;
  model?: string;
  sourceImage?: string;
  negativePrompt?: string;
  steps?: number;
  videoType?: VideoGenerationType;
}

export interface GeneratedMedia {
  id: string;
  type: GenerationType;
  prompt: string;
  url: string;
  createdAt: string;
  folderId?: string;
  variations?: string[];
}

export interface MediaFolder {
  id: string;
  name: string;
  createdAt: string;
  mediaIds: string[];
}