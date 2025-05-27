import { For } from 'solid-js';
import type { Message } from '../interfaces/Message';

export default function Conversation(props: {
  messages: Message[];
  sendMessage: Function;
}) {
  const messages = () => props.messages as Message[];
  const sendMessage = (msg: Message) => props.sendMessage(msg);

  return (
    <main class="flex-1 flex flex-col justify-between bg-white p-4">
      <div class="overflow-y-auto mb-4 space-y-2 max-h-[calc(100vh-160px)]">
        <For each={messages()}>
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
                {new Date(msg.createdAt).toISOString()}
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
              createdAt: new Date(Date.now()),
            };
            sendMessage(msg);
          }}
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Envoyer
        </button>
      </div>
    </main>
  );
}
