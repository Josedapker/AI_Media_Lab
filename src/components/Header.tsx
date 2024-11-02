import React, { useState } from 'react';
import { Cpu, FolderTree, User, LogOut } from 'lucide-react';
import { useMediaStore } from '../store/mediaStore';
import clsx from 'clsx';

export function Header() {
  const [showNav, setShowNav] = useState(false);
  const { folders, activeFolder, setActiveFolder } = useMediaStore();

  return (
    <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cpu className="w-6 h-6" />
            <h1 className="text-xl font-bold">AI Media Lab</h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNav(!showNav)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Account</span>
              </button>

              {showNav && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="py-1">
                    <a
                      href="/account"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </a>
                    <button
                      onClick={() => {
                        // Handle logout
                        setShowNav(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNav(!showNav)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <FolderTree className="w-4 h-4" />
                <span className="text-sm">Folders</span>
              </button>

              {showNav && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveFolder(null);
                        setShowNav(false);
                      }}
                      className={clsx(
                        'w-full text-left px-4 py-2',
                        !activeFolder ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      All Media
                    </button>
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => {
                          setActiveFolder(folder.id);
                          setShowNav(false);
                        }}
                        className={clsx(
                          'w-full text-left px-4 py-2',
                          activeFolder === folder.id ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        {folder.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}