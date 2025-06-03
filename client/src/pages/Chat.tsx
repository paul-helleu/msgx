import toast, { Toaster } from 'solid-toast';
import ConversationList from '../components/ConversationList';
import type { Message } from '../interfaces/Message';
import { io } from 'socket.io-client';
import { createEffect, onMount } from 'solid-js';
import Conversation from '../components/Conversation';
import { useAuth } from '../components/AuthContext';
import { showNotifMessageToast } from '../components/MessageToast';
import ConversationHeader from '../components/ConversationHeader';
import ProfileFooter from '../components/ProfileFooter';
import { useParams } from '@solidjs/router';
import { useApp } from '../components/AppContext';

export default function Chat() {
  const params = useParams();
  const channelId = () => params.channelId;
  const socket = io('http://127.0.0.1:3300');
  const { user } = useAuth();

  const { storeChat, setStoreChat, setUserStatus } = useApp();

  createEffect(() => {
    for (const conversation of storeChat.conversations) {
      socket.emit('joinChannel', conversation.channel_id);
    }
  }, storeChat.conversations);

  const sendMsg = (message: Message) => {
    socket.emit('message', {
      channelId: storeChat.currentChannelId,
      message,
      senderId: user()?.id,
    });

    if (!storeChat.currentChannelId) {
      return;
    }

    fetch(`http://localhost:3000/api/messages/${storeChat.currentChannelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content: message.content }),
    }).catch((err: Error) => {
      toast.error('Une erreur est survenu: ' + err.message);
    });
  };

  onMount(() => {
    socket.on('message', ({ message, channelId }) => {
      if (storeChat.currentChannelId === channelId) {
        setStoreChat('messages', (messages) => [...messages, message]);
        return;
      }

      showNotifMessageToast({
        content: message.content,
        username: message.Sender.username,
      });

      setStoreChat('conversations', (convs) =>
        convs.map((conv) =>
          conv.channel_id === channelId
            ? { ...conv, newMessagesCount: (conv.newMessagesCount || 0) + 1 }
            : conv
        )
      );
    });

    const username = user()?.username;
    if (!username) return;

    socket.emit('announce-presence', username);

    socket.emit('who-is-online');

    socket.on('who-is-online-request', (requesterSocketId: string) => {
      socket.emit('i-am-online', { toSocketId: requesterSocketId, username });
    });

    socket.on('user-connected', (username: string) => {
      setUserStatus(username, 'online');
    });

    socket.on('user-disconnected', (username: string) => {
      setUserStatus(username, 'offline');
    });

    socket.on('i-am-online', (username: string) => {
      setUserStatus(username, 'online');
    });
  });
  return (
    <div class="flex flex-col md:flex-row h-screen">
      <div class="bg-red-500 bg-orange-500 bg-amber-500 bg-yellow-500 bg-lime-500 bg-green-500 bg-emerald-500 bg-teal-500 bg-cyan-500 bg-sky-500 bg-blue-500 bg-violet-500 bg-purple-500 bg-fuchsia-500 bg-pink-500 bg-rose-500"></div>
      <aside class="w-full md:w-1/4 border-r border-gray-200 bg-gray-50 flex flex-col h-full">
        <ConversationList
          conversations={storeChat.conversations}
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
          user={user()}
        />
      </main>
    </div>
  );
}
