import React from 'react';
import { useModelStore } from '../store/modelStore';
import { Brain, CheckCircle, Loader } from 'lucide-react';

export function ModelStatus() {
  const { models } = useModelStore();

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h2 className="font-semibold">Model Status</h2>
      </div>
      <div className="space-y-4">
        {models.map((model) => (
          <div key={model.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{model.name}</p>
              <p className="text-sm text-gray-500">Type: {model.type}</p>
            </div>
            {model.status === 'loaded' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Loader className="w-5 h-5 text-blue-500 animate-spin" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}