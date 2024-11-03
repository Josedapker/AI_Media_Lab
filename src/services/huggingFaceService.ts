import { HfInference } from '@huggingface/inference';

const HUGGING_FACE_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY?.trim();

if (!HUGGING_FACE_API_KEY) {
  console.warn('Missing Hugging Face API key! Set VITE_HUGGING_FACE_API_KEY in .env');
}

// Initialize HF client without 'Bearer' prefix - the library handles this
export const hf = new HfInference(HUGGING_FACE_API_KEY); 