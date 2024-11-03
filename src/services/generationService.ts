import { generateMedia } from '../lib/api';
import type {
  GeneratedMedia,
  GenerationRequest,
} from '../types';

async function generateWithLocalModel(prompt: string, model: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model_id: model,
        negative_prompt: 'blurry, bad quality, distorted',
        num_inference_steps: 20,
        guidance_scale: 7.5
      })
    });

    if (!response.ok) {
      throw new Error(`Generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.image;
  } catch (error) {
    console.error('Local generation failed:', error);
    throw error;
  }
}

export async function generateImage(request: GenerationRequest): Promise<GeneratedMedia> {
  if (!request.prompt?.trim()) {
    throw new Error('Prompt is required');
  }

  if (request.model?.startsWith('stabilityai/') || 
      request.model?.startsWith('runwayml/') || 
      request.model?.startsWith('CompVis/')) {
    try {
      const imageUrl = await generateWithLocalModel(request.prompt, request.model);
      return {
        id: Math.random().toString(36).substring(7),
        type: 'image',
        prompt: request.prompt,
        url: imageUrl,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Generation failed:', error);
      return generateMedia(request);
    }
  }
  
  return generateMedia(request);
} 