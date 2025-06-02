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
import ConversationHeader from '../components/ConversationHeader';
import { useParams } from '@solidjs/router';
import ProfileFooter from '../components/ProfileFooter';

export default function Chat() {
  const params = useParams();
  const channelId = () => params.channelId;

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
      <div class="bg-red-500 bg-orange-500 bg-amber-500 bg-yellow-500 bg-lime-500 bg-green-500 bg-emerald-500 bg-teal-500 bg-cyan-500 bg-sky-500 bg-blue-500 bg-violet-500 bg-purple-500 bg-fuchsia-500 bg-pink-500 bg-rose-500"></div>
      <aside class="w-full md:w-1/4 border-r border-gray-200 bg-gray-50 flex flex-col h-full">
        <ConversationList
          conversations={storeChat.conversations}
          setStoreChat={setStoreChat}
          currentChannelId={storeChat.currentChannelId}
          channelId={channelId()}
          user={user()}
        />
        <ProfileFooter user={user()} />
      </aside>
      <main class="flex-1 flex flex-col justify-between">
        <ConversationHeader conversation={storeChat.currentConversation} />
        <Toaster />
        <Conversation
          messages={storeChat.messages}
          currentConversation={storeChat.currentConversation}
          sendMessage={sendMsg}
          setStoreChat={setStoreChat}
          user={user()}
        />
      </main>
    </div>
  );
}
