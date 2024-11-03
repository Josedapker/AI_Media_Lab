import { hf } from './huggingFaceService';

// Models that work well on M1/M3 Macs
const SUPPORTED_MODELS = {
  'stabilityai/sdxl-turbo': {
    type: 'diffusion',
    name: 'SDXL Turbo',
    description: 'Fast, high-quality image generation'
  },
  'runwayml/stable-diffusion-v1-5': {
    type: 'diffusion',
    name: 'Stable Diffusion 1.5',
    description: 'Balanced quality and speed'
  },
  'CompVis/stable-diffusion-v1-4': {
    type: 'diffusion',
    name: 'Stable Diffusion 1.4',
    description: 'Lightweight, fast generation'
  }
};

export async function generateImage(prompt: string, model: string) {
  try {
    const result = await hf.textToImage({
      inputs: prompt,
      model: model,
      parameters: {
        negative_prompt: 'blurry, bad quality, distorted',
        num_inference_steps: 20,
        guidance_scale: 7.5
      }
    });

    return result;
  } catch (error) {
    console.error('Image generation failed:', error);
    throw error;
  }
}

export function getSupportedModels() {
  return SUPPORTED_MODELS;
} 