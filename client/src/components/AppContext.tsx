import { createContext, useContext } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import { createStore, type SetStoreFunction } from 'solid-js/store';
import type { ChatStore } from '../interfaces/Chat';

export interface AppContextType {
  storeChat: ChatStore;
  setStoreChat: SetStoreFunction<ChatStore>;
  userStatus: {
    [username: string]: 'online' | 'offline';
  };
  setUserStatus: SetStoreFunction<{
    [username: string]: 'online' | 'offline';
  }>;
  switchConversation: (channelId: string) => void;
}

const AppContext = createContext<AppContextType>();

export function AppProvider(props: { children: JSX.Element }) {
  const [storeChat, setStoreChat] = createStore<ChatStore>({
    messages: [],
    conversations: [],
  });
  const [userStatus, setUserStatus] = createStore<{
    [username: string]: 'online' | 'offline';
  }>({});

  const switchConversation = (channelId: string) => {
    const conv = storeChat.conversations.find(
      (el) => el.channel_id === channelId
    );
    setStoreChat('currentConversation', conv ? { ...conv } : undefined);
  };

  const context: AppContextType = {
    storeChat,
    setStoreChat,
    userStatus,
    setUserStatus,
    switchConversation,
  };

  return (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
