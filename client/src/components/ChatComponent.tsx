import { createSignal, For, onMount } from 'solid-js';
import type { Message } from '../types';
import { useAuth } from './AuthContext';

type ChatComponentProps = {
  convId: number;
};

export default function ChatComponent({ convId }: ChatComponentProps) {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const { user } = useAuth();

  onMount(async () => {
    const res = await fetch(
      `http://localhost:3000/api/auth/messages/` + convId,
      {
        headers: {
          authorization: `${localStorage.getItem('token')}`,
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  });

  return (
    <>
      <div class="overflow-y-auto mb-4 space-y-2 max-h-[calc(100vh-160px)]">
        <For each={messages()}>
          {(msg) => (
            <div
              class={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                msg.Sender.id === user().id
                  ? 'bg-indigo-500 text-white self-end ml-auto'
                  : 'bg-gray-200 text-gray-900 self-start mr-auto'
              }`}
            >
              <p>{msg.content}</p>
              <span class="text-xs opacity-60 block mt-1">
                {new Date(msg.createdAt).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
                {' - '}
                {new Date(msg.createdAt).toLocaleString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
        </For>
      </div>

      {/* Input bar */}
      <div class="flex items-center gap-2 border-t pt-3">
        <input
          type="text"
          placeholder="Écrivez un message..."
          class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-300"
        />
        <button class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          Envoyer
        </button>
      </div>
    </>
  );
}
