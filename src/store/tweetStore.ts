import { create } from 'zustand';

interface Media {
  type: 'image' | 'video';
  url: string;
}

interface Tweet {
  id: string;
  content: string;
  media?: Media[];
  timestamp: string;
}

interface TweetStore {
  tweets: Tweet[];
  addTweet: (content: string, media?: Media[]) => void;
  removeTweet: (id: string) => void;
  clearTweets: () => void;
}

export const useTweetStore = create<TweetStore>((set) => ({
  tweets: [],
  
  addTweet: (content, media) => set((state) => ({
    tweets: [
      {
        id: Math.random().toString(36).substring(7),
        content,
        media,
        timestamp: new Date().toISOString(),
      },
      ...state.tweets,
    ],
  })),
  
  removeTweet: (id) => set((state) => ({
    tweets: state.tweets.filter((tweet) => tweet.id !== id),
  })),
  
  clearTweets: () => set({ tweets: [] }),
}));