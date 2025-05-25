import { For } from 'solid-js';
import ConversationList from '../components/ConversationList';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

const messages: Message[] = [
  { id: 1, sender: 'Alice', content: 'Salut !', timestamp: '10:00' },
  { id: 2, sender: 'Moi', content: 'Hey ! Ça va ?', timestamp: '10:01' },
];
export default function ConversationV2() {
  return (
    <div class="flex flex-col md:flex-row h-screen">
      {/* Sidebar contacts */}
      <ConversationList />

      {/* Main chat area */}
      <main class="flex-1 flex flex-col justify-between bg-white p-4">
        <div class="overflow-y-auto mb-4 space-y-2 max-h-[calc(100vh-160px)]">
          <For each={messages}>
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
                  {msg.timestamp}
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
      </main>
    </div>
  );
}
