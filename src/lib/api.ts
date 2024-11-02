import type { GenerationRequest, GeneratedMedia } from '../types';

const MOCK_DELAY = 1000;

// High-quality demo images from Unsplash
const MOCK_IMAGES = [
  // Landscapes
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', // Yosemite
  'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80', // Mountain Lake
  'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800&q=80', // Forest
  
  // Cityscapes
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80', // Tokyo
  'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&q=80', // New York
  
  // Abstract/AI Style
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80', // Geometric
  'https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=800&q=80', // Neon
  
  // Portrait Style
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', // Portrait
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', // Creative
];

// Demo videos (these are placeholders since we can't actually serve videos)
const MOCK_VIDEOS = [
  'https://example.com/demo-video-1.mp4',
  'https://example.com/demo-video-2.mp4',
];

const MOCK_PROMPTS = [
  'A serene mountain landscape at sunset',
  'Futuristic cityscape with neon lights',
  'Abstract geometric patterns in vibrant colors',
  'Portrait in cyberpunk style',
  'Mystical forest with glowing elements',
];

export async function generateMedia(request: GenerationRequest): Promise<GeneratedMedia> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  const randomId = Math.random().toString(36).substring(7);
  const urls = request.type === 'video' ? MOCK_VIDEOS : MOCK_IMAGES;
  const url = urls[Math.floor(Math.random() * urls.length)];
  
  // Generate variations for images
  const variations = request.type === 'image' 
    ? [
        MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
        MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
        MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
      ]
    : undefined;

  return {
    id: randomId,
    type: request.type,
    prompt: request.prompt || MOCK_PROMPTS[Math.floor(Math.random() * MOCK_PROMPTS.length)],
    url,
    variations,
    createdAt: new Date().toISOString(),
  };
}

// Helper function to generate multiple items for initial state
export function generateInitialMedia(count: number = 5): GeneratedMedia[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `demo-${i}`,
    type: Math.random() > 0.2 ? 'image' : 'video',
    prompt: MOCK_PROMPTS[i % MOCK_PROMPTS.length],
    url: MOCK_IMAGES[i % MOCK_IMAGES.length],
    variations: [
      MOCK_IMAGES[(i + 1) % MOCK_IMAGES.length],
      MOCK_IMAGES[(i + 2) % MOCK_IMAGES.length],
    ],
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
  }));
}