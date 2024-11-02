import React from 'react';
import { Trash2 } from 'lucide-react';
import { useTweetStore } from '../store/tweetStore';

export function TweetList() {
  const { tweets, removeTweet } = useTweetStore();

  if (tweets.length === 0) return null;

  return (
    <div className="space-y-2">
      {tweets.map((tweet) => (
        <div
          key={tweet.id}
          className="p-3 bg-gray-50 rounded-lg space-y-2 group relative"
        >
          <button
            onClick={() => removeTweet(tweet.id)}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
          >
            <Trash2 className="w-4 h-4 text-gray-600" />
          </button>

          <p className="text-sm pr-8">{tweet.content}</p>
          
          {tweet.media && tweet.media.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {tweet.media.map((media, index) => (
                <div key={index} className="relative aspect-square">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover rounded-lg"
                      controls
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          
          <span className="text-xs text-gray-500">
            {new Date(tweet.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}