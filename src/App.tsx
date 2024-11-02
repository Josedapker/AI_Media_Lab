import React, { useState } from 'react';
import { Header } from './components/Header';
import { GenerationForm } from './components/GenerationForm';
import { GeneratedContent } from './components/GeneratedContent';
import { ThreadComposer } from './components/ThreadComposer';
import { MessageCircle, X } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';

export function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Thread Composer - Left Column */}
          <div className="col-span-3">
            <div className="sticky top-8">
              <ThreadComposer />
            </div>
          </div>

          {/* AI Media Generation - Middle Column */}
          <div className="col-span-6">
            <GenerationForm />
          </div>

          {/* Generated Content - Right Column */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Generated Content</h2>
              <GeneratedContent />
            </div>
          </div>
        </div>
      </main>

      {/* AI Assistant Chat Bubble */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-4">
        {showChat && (
          <div className="w-96 h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ChatInterface />
          </div>
        )}
        
        <button
          onClick={() => setShowChat(true)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}