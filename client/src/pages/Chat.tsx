import toast, { Toaster } from 'solid-toast';
import ConversationList from '../components/ConversationList';
import type { Message } from '../interfaces/Message';
import type { ChatStore } from '../interfaces/Chat';
import { createStore } from 'solid-js/store';
import { io } from 'socket.io-client';
import { createEffect, createSignal, onMount } from 'solid-js';
import Conversation from '../components/Conversation';
import { useAuth } from '../components/AuthContext';
import { showNotifMessageToast } from '../components/MessageToast';
import type { ConversationResponse } from '../interfaces/Conversation';

export default function Chat() {
  const socket = io('http://127.0.0.1:3300');
  const { user } = useAuth();

  const [storeChat, setStoreChat] = createStore<ChatStore>({
    messages: [],
    conversations: [],
    currentChannelId: '',
  });

  createEffect(() => {
    for (const conversation of storeChat.conversations) {
      socket.emit('joinChannel', conversation.channel_id);
    }
  }, storeChat.conversations);

  const fetchConversations = () => {
    fetch(`http://localhost:3000/api/auth/conversations`, {
      headers: {
        authorization: `${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        res.json().then((json) => {
          const conversationResponses = json as ConversationResponse[];
          setStoreChat('conversations', () => conversationResponses);

          if (conversationResponses.length) {
            setStoreChat(
              'currentChannelId',
              () => conversationResponses[0].channel_id
            );
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendMsg = (message: Message) => {
    socket.emit('message', {
      channelId: storeChat.currentChannelId,
      message,
      senderId: user()?.id, // senderId = token in the cookie
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
      } else {
        showNotifMessageToast(message);
      }
    });
  });

  return (
    <div class="flex flex-col md:flex-row h-screen">
      <ConversationList
        conversations={storeChat.conversations}
        setStoreChat={setStoreChat}
        fetchConversations={fetchConversations}
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
