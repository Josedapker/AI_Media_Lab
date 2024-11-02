import React from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import clsx from 'clsx';

export function ThreadList() {
  const {
    threads,
    activeThread,
    setActiveThread,
    createThread,
    deleteThread,
  } = useChatStore();

  return (
    <div className="space-y-4">
      <button
        onClick={() => createThread()}
        className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>New Thread</span>
      </button>

      <div className="space-y-2">
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => setActiveThread(thread.id)}
            className={clsx(
              'w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors group',
              activeThread?.id === thread.id
                ? 'bg-purple-100 text-purple-700'
                : 'hover:bg-gray-100'
            )}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="flex-1 text-left truncate">
              {thread.title || 'New Thread'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.id);
              }}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}