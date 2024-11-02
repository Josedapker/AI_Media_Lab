import { useState } from 'react';
import type { GenerationRequest, GeneratedMedia } from '../types';
import { generateMedia } from '../lib/api';

export function useGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const generate = async (request: GenerationRequest) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);
      
      const result = await generateMedia(request);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      throw err;
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };
  
  return {
    generate,
    isGenerating,
    progress,
    error,
  };
}