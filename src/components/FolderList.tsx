import React from 'react';
import { Folder as FolderIcon, MoreVertical, Plus } from 'lucide-react';
import { useMediaStore } from '../store/mediaStore';
import clsx from 'clsx';

export function FolderList() {
  const { folders, activeFolder, setActiveFolder, addFolder } = useMediaStore();

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Folders</h2>
        <button
          onClick={() => addFolder('New Folder')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => setActiveFolder(null)}
          className={clsx(
            'w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
            activeFolder === null
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          <FolderIcon className="w-5 h-5" />
          <span className="flex-1 text-left">All Media</span>
        </button>

        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setActiveFolder(folder.id)}
            className={clsx(
              'w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors group',
              activeFolder === folder.id
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <FolderIcon className="w-5 h-5" />
            <span className="flex-1 text-left">{folder.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Show folder actions menu
              }}
              className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}