import { createEffect, createSignal, For } from 'solid-js';
import type { Message } from '../interfaces/Message';
import type { ChatStore } from '../interfaces/Chat';
import type { SetStoreFunction } from 'solid-js/store';
import type { User } from '../interfaces/User';
import MessageComponent from './MessageComponent';
import { FiSend } from 'solid-icons/fi';
import type { ConversationResponse } from '../interfaces/Conversation';

function prepareMessages(
  messages: Message[]
): (Message & { showMeta: boolean })[] {
  const result: (Message & { showMeta: boolean })[] = [];

  for (let i = 0; i < messages.length; i++) {
    const current = messages[i];
    const previous = messages[i - 1];

    const isSameSender = previous?.Sender.id === current.Sender.id;
    const isSameMinute =
      previous &&
      Math.abs(
        new Date(current.createdAt).getTime() -
          new Date(previous.createdAt).getTime()
      ) <
        60 * 1000;

    result.push({
      ...current,
      showMeta: !(isSameSender && isSameMinute),
    });
  }

  return result;
}

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
  currentConversation?: ConversationResponse;
  user: User | null;
}) {
  const messages = () => props.messages as Message[];
  const sendMessage = (msg: Message) => props.sendMessage(msg);
  const currentChannelId = () => props.currentConversation?.channel_id ?? '';

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
    <div class="flex-1 flex flex-col justify-between bg-white p-4">
      <div class="overflow-y-auto mb-4 space-y-2 max-h-[calc(100vh-160px)]">
        <For each={prepareMessages(messages())}>
          {(msg) => (
            <MessageComponent
              sendByMe={msg.Sender.id === props.user?.id}
              msg={msg}
              showMeta={msg.showMeta}
            />
          )}
        </For>
      </div>

      <div class="flex items-center border rounded-full px-4 py-2 shadow-sm bg-white w-full">
        <input
          type="text"
          placeholder={`Envoyer un message à ${props.currentConversation?.name}`}
          value={messageContent()}
          onInput={(e) => setMessageContent(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
          class="flex-1 border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400 bg-transparent"
        />
        <button
          onClick={handleSendMessage}
          class="text-gray-500 hover:text-zinc-600 transition text-lg ml-1"
        >
          <FiSend class="text-2xl" />
        </button>
      </div>
    </div>
  );
}
