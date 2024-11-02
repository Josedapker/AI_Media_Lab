import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TwitterAccount {
  id: string;
  username: string;
  profileImage: string;
  accessToken: string;
  refreshToken: string;
}

interface TwitterStore {
  accounts: TwitterAccount[];
  activeAccount: TwitterAccount | null;
  setActiveAccount: (id: string) => void;
  connectAccount: () => Promise<void>;
  disconnectAccount: (id: string) => void;
  refreshAccessToken: (id: string) => Promise<void>;
}

export const useTwitterStore = create<TwitterStore>()(
  persist(
    (set, get) => ({
      accounts: [],
      activeAccount: null,

      setActiveAccount: (id) => {
        const account = get().accounts.find((a) => a.id === id);
        set({ activeAccount: account || null });
      },

      connectAccount: async () => {
        try {
          // Open Twitter OAuth popup
          const width = 600;
          const height = 600;
          const left = window.innerWidth / 2 - width / 2;
          const top = window.innerHeight / 2 - height / 2;
          
          const popup = window.open(
            '/api/auth/twitter',
            'Twitter Login',
            `width=${width},height=${height},left=${left},top=${top}`
          );

          // Listen for OAuth callback
          const handleMessage = async (event: MessageEvent) => {
            if (event.data.type === 'TWITTER_AUTH_SUCCESS') {
              const { account } = event.data;
              
              set((state) => ({
                accounts: [...state.accounts, account],
                activeAccount: account,
              }));

              window.removeEventListener('message', handleMessage);
              popup?.close();
            }
          };

          window.addEventListener('message', handleMessage);
        } catch (error) {
          console.error('Twitter connection failed:', error);
        }
      },

      disconnectAccount: (id) => {
        set((state) => {
          const newAccounts = state.accounts.filter((a) => a.id !== id);
          const newActiveAccount = state.activeAccount?.id === id
            ? newAccounts[0] || null
            : state.activeAccount;
          
          return {
            accounts: newAccounts,
            activeAccount: newActiveAccount,
          };
        });
      },

      refreshAccessToken: async (id) => {
        try {
          const account = get().accounts.find((a) => a.id === id);
          if (!account) return;

          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: account.refreshToken }),
          });

          const { accessToken, refreshToken } = await response.json();

          set((state) => ({
            accounts: state.accounts.map((a) =>
              a.id === id
                ? { ...a, accessToken, refreshToken }
                : a
            ),
          }));
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      },
    }),
    {
      name: 'twitter-storage',
      partialize: (state) => ({
        accounts: state.accounts.map(({ id, username, profileImage }) => ({
          id,
          username,
          profileImage,
        })),
        activeAccount: state.activeAccount
          ? {
              id: state.activeAccount.id,
              username: state.activeAccount.username,
              profileImage: state.activeAccount.profileImage,
            }
          : null,
      }),
    }
  )
);