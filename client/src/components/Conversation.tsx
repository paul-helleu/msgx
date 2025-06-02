import { createEffect, createSignal, For } from 'solid-js';
import type { Message } from '../interfaces/Message';
import type { ChatStore } from '../interfaces/Chat';
import type { SetStoreFunction } from 'solid-js/store';
import type { User } from '../interfaces/User';

const fetchMessage = (
  currentChannelId: string,
  setStoreChat: SetStoreFunction<ChatStore>
) => {
  fetch(`http://localhost:3000/api/auth/messages/${currentChannelId}`, {
    headers: {
      authorization: `${localStorage.getItem('token')}`,
    },
  })
    .then((res) =>
      res
        .json()
        .then((json) => setStoreChat('messages', () => json as Message[]))
    )
    .catch((err) => console.log(err));
};

export default function Conversation(props: {
  messages: Message[];
  sendMessage: Function;
  setStoreChat: SetStoreFunction<ChatStore>;
  currentChannelId: string;
  user: User | null;
}) {
  const messages = () => props.messages as Message[];
  const currentChannelId = () => props.currentChannelId as string;
  const sendMessage = (msg: Message) => props.sendMessage(msg);

  const [messageContent, setMessageContent] = createSignal('');

  const handleSendMessage = () => {
    const content = messageContent().trim();

    if (!content || !props.user) return;

    const msg = {
      id: Date.now(),
      content: content,
      Sender: props.user,
    } as Message;

    sendMessage(msg);
    setMessageContent('');
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  createEffect(() => {
    if (currentChannelId()) {
      fetchMessage(currentChannelId(), props.setStoreChat);
    }
  });

  return (
    <>
      <div class="overflow-y-auto mb-4 space-y-2 max-h-[calc(100vh-160px)]">
        <For each={messages()}>
          {(msg) => (
            <div
              class={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                msg.Sender.id === props.user?.id
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

      <div class="flex items-center gap-2 border-t pt-3">
        <input
          type="text"
          placeholder="Écrivez un message..."
          value={messageContent()}
          onInput={(e) => setMessageContent(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
          class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-300"
        />
        <button
          onClick={handleSendMessage}
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Envoyer
        </button>
      </div>
    </>
  );
}
