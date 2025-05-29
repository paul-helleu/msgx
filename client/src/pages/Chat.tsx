import { Toaster } from 'solid-toast';
import ConversationList from '../components/ConversationList';
import type { Message } from '../interfaces/Message';
import type { ChatStore } from '../interfaces/Chat';
import { createStore } from 'solid-js/store';
import { io } from 'socket.io-client';
import { onMount } from 'solid-js';
import Conversation from '../components/Conversation';
import { useAuth } from '../components/AuthContext';
import { showMessageToast } from '../components/MessageToast';

export default function Chat() {
  const currentChannelId = 2;
  const senderId = 1;
  const { user } = useAuth();

  const [storeChat, setStoreChat] = createStore<ChatStore>({
    messages: [],
    conversations: [],
    currentChannelId: '',
  });

  const serverUri = 'http://127.0.0.1:3300';
  const socket = io(serverUri);

  const sendMsg = (message: Message) => {
    socket.emit('message', {
      channelId: currentChannelId,
      message,
      senderId,
    });
  };

  onMount(() => {
    const conversationChannelIds = [1, 2];
    conversationChannelIds.forEach((channelId: number) => {
      socket.emit('joinChannel', channelId);
    });

    socket.on('message', ({ message, channelId }) => {
      if (currentChannelId === channelId) {
        setStoreChat('messages', (messages) => [...messages, message]);
      } else {
        showMessageToast(message);
      }
    });
  });

  return (
    <div class="flex flex-col md:flex-row h-screen">
      <ConversationList
        conversations={storeChat.conversations}
        setStoreChat={setStoreChat}
        currentChannelId={storeChat.currentChannelId}
        user={user()}
      />

      <main class="flex-1 flex flex-col justify-between bg-white p-4">
        <Toaster />
        <Conversation
          messages={storeChat.messages}
          sendMessage={sendMsg}
          setStoreChat={setStoreChat}
          currentChannelId={storeChat.currentChannelId}
          user={user()}
        />
      </main>
    </div>
  );
}
