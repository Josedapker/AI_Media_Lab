import React, { useState } from 'react';
import { useChatStore } from '../store/chatStore';

export function SystemPrompt() {
  const { systemPrompt, updateSystemPrompt } = useChatStore();
  const [prompt, setPrompt] = useState(systemPrompt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemPrompt(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          System Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={6}
          placeholder="Enter system instructions..."
        />
      </div>
      <button
        type="submit"
        disabled={prompt === systemPrompt}
        className="w-full btn btn-primary"
      >
        Update Prompt
      </button>
    </form>
  );
}