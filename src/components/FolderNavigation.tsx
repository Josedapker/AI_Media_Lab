import React, { useState } from 'react';
import { FolderTree, Plus } from 'lucide-react';
import { useMediaStore } from '../store/mediaStore';
import clsx from 'clsx';

export function FolderNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { folders, activeFolder, setActiveFolder, addFolder } = useMediaStore();
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        <FolderTree className="w-5 h-5" />
        <span>Folders</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                setActiveFolder(null);
                setIsOpen(false);
              }}
              className={clsx(
                'w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-left',
                !activeFolder ? 'bg-violet-100 text-violet-700' : 'hover:bg-gray-100'
              )}
            >
              <span>All Media</span>
            </button>

            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => {
                  setActiveFolder(folder.id);
                  setIsOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-left',
                  activeFolder === folder.id ? 'bg-violet-100 text-violet-700' : 'hover:bg-gray-100'
                )}
              >
                <span>{folder.name}</span>
              </button>
            ))}
          </div>

          <div className="border-t p-2">
            <form onSubmit={handleCreateFolder} className="flex space-x-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="New folder..."
                className="flex-1 px-3 py-1 text-sm border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newFolderName.trim()}
                className="p-1 text-violet-600 hover:bg-violet-50 rounded-lg disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}