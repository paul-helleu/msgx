import { createEffect, createSignal, For } from 'solid-js';
import type { Message } from '../interfaces/Message';
import type { ChatStore } from '../interfaces/Chat';
import type { SetStoreFunction } from 'solid-js/store';
import type { User } from '../interfaces/User';
import MessageComponent from './MessageComponent';
import { FiSend } from 'solid-icons/fi';
import type { ConversationResponse } from '../interfaces/Conversation';

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
}

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
      createdAt: new Date(Date.now()),
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
        <For each={messages()}>
          {(msg) => (
            <MessageComponent
              sendByMe={msg.Sender.id === props.user?.id}
              msg={msg}
            ></MessageComponent>
          )}
        </For>
      </div>

      <div class="flex items-center border rounded-full px-4 py-2 shadow-sm bg-white w-full">
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
          <FiSend class="text-2xl" />
        </button>
      </div>
    </div>
  );
}
