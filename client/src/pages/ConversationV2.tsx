import { createEffect, createSignal, For, onCleanup } from 'solid-js';
import type { Message } from '../interfaces/Message';
import { io } from 'socket.io-client';
import { createStore } from 'solid-js/store';
import toast, { Toaster } from 'solid-toast';

export default function ConversationV2() {
  const currentChannelId = 1;
  const senderId = 1;

  const [storeMessage, setStoreMessage] = createStore({
    messages: [
      {
        id: 1,
        sender: 'Alice',
        content: 'Salut !',
        timestamp: new Date(Date.now() - 5000),
      } as Message,
      {
        id: 2,
        sender: 'Moi',
        content: 'Hey ! Ça va ?',
        timestamp: new Date(Date.now() - 1000),
      } as Message,
    ],
  });

  const serverUri: string = 'http://127.0.0.1:3300';
  const socket = io(serverUri);

  const conversationChannelIds = [1, 2];
  conversationChannelIds.forEach((channelId: number) => {
    socket.emit('joinChannel', channelId);
  });

  socket.on('newMessage', ({ message, channelId, senderId }) => {
    console.log(message);

    if (currentChannelId === channelId) {
      setStoreMessage('messages', (messages) => [...messages, message]);
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

  const sendMsg = (message: Message) => {
    socket.emit('sendMessage', {
      channelId: currentChannelId,
      message,
      senderId,
    });
  };

  return (
    <main class="flex-1 flex flex-col justify-between bg-white p-4">
      <Toaster />

      <div class="overflow-y-auto mb-4 space-y-2 max-h-[calc(100vh-160px)]">
        <For each={storeMessage.messages}>
          {(msg) => (
            <div
              class={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                msg.sender === 'Moi'
                  ? 'bg-indigo-500 text-white self-end ml-auto'
                  : 'bg-gray-200 text-gray-900 self-start mr-auto'
              }`}
            >
              <p>{msg.content}</p>
              <span class="text-xs opacity-60 block mt-1">
                {new Date(msg.timestamp).toISOString()}
              </span>
            </div>
          )}
        </For>
      </div>

      <div class="flex items-center gap-2 border-t pt-3">
        <input
          type="text"
          placeholder="Écrivez un message..."
          class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-300"
        />
        <button
          onClick={() => {
            const msg = {
              id: 3,
              content: 'Hello',
              sender: 'Moi',
              timestamp: new Date(Date.now()),
            };
            sendMsg(msg);
          }}
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Envoyer
        </button>
      </div>
    </main>
  );
}
