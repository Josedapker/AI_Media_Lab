import React from 'react';
import { Twitter, LogOut, Plus } from 'lucide-react';
import { useTwitterStore } from '../store/twitterStore';
import clsx from 'clsx';

export function TwitterAccountSelector() {
  const {
    accounts,
    activeAccount,
    setActiveAccount,
    connectAccount,
    disconnectAccount,
  } = useTwitterStore();

  if (accounts.length === 0) {
    return (
      <button
        onClick={connectAccount}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-colors"
      >
        <Twitter className="w-4 h-4" />
        <span>Connect Twitter</span>
      </button>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Twitter className="w-4 h-4 text-[#1DA1F2]" />
        <span>@{activeAccount?.username}</span>
      </button>

      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
        {accounts.map((account) => (
          <button
            key={account.id}
            onClick={() => setActiveAccount(account.id)}
            className={clsx(
              'w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100',
              activeAccount?.id === account.id && 'text-[#1DA1F2]'
            )}
          >
            <div className="flex items-center space-x-2">
              <img
                src={account.profileImage}
                alt=""
                className="w-6 h-6 rounded-full"
              />
              <span>@{account.username}</span>
            </div>
            {activeAccount?.id === account.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  disconnectAccount(account.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </button>
        ))}
        
        <div className="border-t mt-2 pt-2">
          <button
            onClick={connectAccount}
            className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
            <span>Add another account</span>
          </button>
        </div>
      </div>
    </div>
  );
}