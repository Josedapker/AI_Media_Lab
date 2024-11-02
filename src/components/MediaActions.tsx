import React, { useState } from 'react';
import { Folder, Trash2, Copy, X, Plus } from 'lucide-react';
import { useMediaStore } from '../store/mediaStore';

export function MediaActions() {
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  
  const {
    selectedMediaIds,
    folders,
    addFolder,
    moveToFolder,
    removeMedia,
    clearSelection,
  } = useMediaStore();

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      addFolder(folderName.trim());
      setFolderName('');
      setShowNewFolder(false);
    }
  };

  if (selectedMediaIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
      <button
        onClick={() => setShowNewFolder(true)}
        className="btn btn-secondary"
      >
        <Folder className="w-4 h-4 mr-2" />
        New Folder
      </button>

      <div className="relative">
        <button className="btn btn-secondary">
          <Folder className="w-4 h-4 mr-2" />
          Move to Folder
        </button>
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg py-2">
          <button
            onClick={() => moveToFolder(selectedMediaIds, null)}
            className="w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Remove from Folder
          </button>
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => moveToFolder(selectedMediaIds, folder.id)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              {folder.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => removeMedia(selectedMediaIds)}
        className="btn btn-secondary text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </button>

      <button
        onClick={clearSelection}
        className="btn btn-secondary"
      >
        <X className="w-4 h-4" />
      </button>

      {showNewFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={handleCreateFolder}
            className="bg-white rounded-lg p-6 w-96"
          >
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              placeholder="Folder name"
              autoFocus
            />
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setShowNewFolder(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!folderName.trim()}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}