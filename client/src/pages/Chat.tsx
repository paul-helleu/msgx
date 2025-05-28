import toast, { Toaster } from 'solid-toast';
import ConversationList from '../components/ConversationList';
import type { Message } from '../interfaces/Message';
import type { ChatStore } from '../interfaces/Chat';
import { createStore } from 'solid-js/store';
import { io } from 'socket.io-client';
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import Conversation from '../components/Conversation';
import { useAuth } from '../components/AuthContext';

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

    socket.on('message', ({ message, channelId, senderId }) => {
      if (currentChannelId === channelId) {
        setStoreChat('messages', (messages) => [...messages, message]);
      } else {
        // Toast with a countdown timer
        const duration = 3000;
        toast.custom(
          (t) => {
            // Start with 100% life
            const [life, setLife] = createSignal(100);
            const startTime = Date.now();
            createEffect(() => {
              if (t.paused) return;
              const interval = setInterval(() => {
                const diff = Date.now() - startTime - t.pauseDuration;
                setLife(100 - (diff / duration) * 100);
              });

              onCleanup(() => clearInterval(interval));
            });

            return (
              <div
                class={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } bg-cyan-600 p-3 rounded-md shadow-md min-w-[350px]`}
              >
                <div class="flex gap-2">
                  <div class="flex flex-1 flex-col">
                    <div class="font-medium text-white">
                      New version available
                    </div>
                    <div class="text-sm text-cyan-50">{message.content}</div>
                  </div>
                  <div class="flex items-center">
                    <button
                      class="px-3.5 h-4/5 tracking-wide font-medium rounded-md text-sm text-white bg-cyan-500 hover:bg-cyan-500/70"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      CANCEL
                    </button>
                  </div>
                  <div class="flex items-center">
                    <button
                      class="px-2.5 flex items-center relative h-4/5 tracking-wide rounded-md text-2xl text-white bg-cyan-500/40 hover:bg-cyan-500/20"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      x
                    </button>
                  </div>
                </div>
                <div class="relative pt-4">
                  <div class="w-full h-1 rounded-full bg-cyan-900"></div>
                  <div
                    class="h-1 top-4 absolute rounded-full bg-cyan-50"
                    style={{ width: `${life()}%` }}
                  ></div>
                </div>
              </div>
            );
          },
          {
            duration: duration,
          }
        );
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
