import React, { useState, useCallback } from 'react';
import { MessageSquare, Send, Sparkles, Wand2 } from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { MediaControls } from './MediaControls';
import { TwitterAccountSelector } from './TwitterAccountSelector';
import { TweetList } from './TweetList';
import { useTwitterStore } from '../store/twitterStore';
import { useTweetStore } from '../store/tweetStore';
import { useAIOptimize } from '../hooks/useAIOptimize';

const MAX_TWEET_LENGTH = 280;

export function ThreadComposer() {
  const [selectedModel, setSelectedModel] = useState('gpt4');
  const [currentTweet, setCurrentTweet] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [isThreadMode, setIsThreadMode] = useState(false);
  
  const { activeAccount } = useTwitterStore();
  const { addTweet } = useTweetStore();
  const { optimizeTweet, generateSampleTweet, isOptimizing } = useAIOptimize();

  const handleTweetChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCurrentTweet(text);
    setCharCount(text.length);
    
    // Auto-detect thread mode
    if (text.length > MAX_TWEET_LENGTH) {
      setIsThreadMode(true);
    } else if (text.length === 0) {
      setIsThreadMode(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTweet.trim()) return;

    const media = await Promise.all(
      mediaFiles.map(async (file) => ({
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file),
      }))
    );

    if (isThreadMode) {
      // Split into multiple tweets
      const words = currentTweet.split(' ');
      let currentPart = '';
      let parts: string[] = [];

      words.forEach((word) => {
        const potentialPart = currentPart ? `${currentPart} ${word}` : word;
        
        if (potentialPart.length <= MAX_TWEET_LENGTH) {
          currentPart = potentialPart;
        } else {
          parts.push(currentPart);
          currentPart = word;
        }
      });

      if (currentPart) {
        parts.push(currentPart);
      }

      // Add thread numbering
      parts = parts.map((part, i) => 
        `${part} ${i + 1}/${parts.length}`
      );

      // Create thread tweets
      parts.forEach((part, i) => {
        addTweet(
          part,
          i === 0 ? media : undefined // Only attach media to first tweet
        );
      });
    } else {
      addTweet(currentTweet, media.length > 0 ? media : undefined);
    }

    setCurrentTweet('');
    setMediaFiles([]);
    setCharCount(0);
    setIsThreadMode(false);
  };

  const handleOptimize = async () => {
    if (!currentTweet.trim()) return;
    const optimizedTweet = await optimizeTweet(currentTweet);
    setCurrentTweet(optimizedTweet);
    setCharCount(optimizedTweet.length);
  };

  const handleGenerateSample = async () => {
    const sampleTweet = await generateSampleTweet();
    setCurrentTweet(sampleTweet);
    setCharCount(sampleTweet.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold">Thread Composer</h2>
        </div>
        <TwitterAccountSelector />
      </div>

      <div className="flex flex-col h-[calc(100%-4rem)]">
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-4">
            <ModelSelector type="text" value={selectedModel} onChange={setSelectedModel} />
            <button
              onClick={handleGenerateSample}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Sample</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 border-t border-b bg-gray-50">
          <TweetList />
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                value={currentTweet}
                onChange={handleTweetChange}
                placeholder={`What's happening? ${activeAccount ? `Posting as @${activeAccount.username}` : ''}`}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                  charCount > MAX_TWEET_LENGTH && !isThreadMode ? 'border-red-500' : ''
                }`}
                rows={3}
              />
              <div className="absolute bottom-2 right-2 flex items-center space-x-2 text-sm">
                <span className={`${
                  charCount > MAX_TWEET_LENGTH && !isThreadMode ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {charCount}/{isThreadMode ? 'Thread' : MAX_TWEET_LENGTH}
                </span>
                {currentTweet.trim() && (
                  <button
                    type="button"
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="p-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Wand2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <MediaControls
              files={mediaFiles}
              onChange={setMediaFiles}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!currentTweet.trim() || (charCount > MAX_TWEET_LENGTH && !isThreadMode)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{isThreadMode ? 'Post Thread' : 'Tweet'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}