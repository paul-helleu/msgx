import { For, onMount } from 'solid-js';
import type { Conversation } from '../interfaces/Conversation';
import type { SetStoreFunction } from 'solid-js/store';
import type { ChatStore } from '../interfaces/Chat';
import type { User } from '../interfaces/User';

export default function ConversationList(props: {
  conversations: Conversation[];
  setStoreChat: SetStoreFunction<ChatStore>;
  currentChannelId: string;
  user: User | null;
}) {
  const currentChannelId = () => props.currentChannelId as string;
  const conversations = () => props.conversations as Conversation[];

  onMount(async () => {
    fetch(`http://localhost:3000/api/auth/conversations`, {
      headers: {
        authorization: `${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        res.json().then((json) => {
          props.setStoreChat('conversations', () => json as Conversation[]);
          if (json[0]) {
            props.setStoreChat(
              'currentChannelId',
              () => json[0].channel_id as string
            );
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  async function handleRswitchChannel(e: Event) {
    const channelId = (e.currentTarget as HTMLElement).dataset.channelId;
    props.setStoreChat('currentChannelId', () => channelId as string);
  }

  return (
    <aside class="w-full md:w-1/4 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
      <h2 class="text-xl font-bold mb-4">Contacts</h2>
      <ul class="space-y-2">
        <For each={conversations()}>
          {(conversation) => (
            <li
              class={`flex items-center justify-between hover:bg-gray-300 p-2 rounded cursor-pointer ${
                conversation.channel_id === currentChannelId()
                  ? 'bg-indigo-500 text-white self-end ml-auto hover:bg-indigo-700'
                  : ''
              }`}
              on:click={handleRswitchChannel}
              data-channel-id={conversation.channel_id}
            >
              <span>{conversation.name}</span>
            </li>
          )}
        </For>
      </ul>
    </aside>
  );
}
