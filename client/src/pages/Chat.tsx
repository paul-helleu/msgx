import toast, { Toaster } from 'solid-toast';
import ConversationList from '../components/ConversationList';
import type { Message } from '../interfaces/Message';
import type { ChatStore } from '../interfaces/Chat';
import { createStore } from 'solid-js/store';
import { io } from 'socket.io-client';
import { createEffect, onMount } from 'solid-js';
import Conversation from '../components/Conversation';
import { useAuth } from '../components/AuthContext';
import { showNotifMessageToast } from '../components/MessageToast';

export default function Chat() {
  const socket = io('http://127.0.0.1:3300');
  const { user } = useAuth();

  const [storeChat, setStoreChat] = createStore<ChatStore>({
    messages: [],
    conversations: [],
    currentChannelId: '',
  });

  const sendMsg = (message: Message) => {
    console.log(storeChat.conversations);
    socket.emit('message', {
      channelId: storeChat.currentChannelId,
      message,
      senderId: user()?.id, // senderId = token in the cookie
    });

    if (!storeChat.currentChannelId) {
      return;
    }

    fetch(`http://localhost:3000/api/messages/${storeChat.currentChannelId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'authorization': `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content: message.content })
    })
    .catch((err: Error) => {
      toast.error("Une erreur est survenu: " + err.message);
    })
  };


  onMount(() => {
    const conversationChannelIds = ["alice_bob_channel", "bob_eve_channel"]; // TODO: foreach conversation ids
    conversationChannelIds.forEach((channelId: string) => {
      socket.emit('joinChannel', channelId);
    });

    socket.on('message', ({ message, channelId }) => {
      if (storeChat.currentChannelId === channelId) {
        setStoreChat('messages', (messages) => [...messages, message]);
      } else {
        showNotifMessageToast(message);
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
