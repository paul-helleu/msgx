import { For, onMount, Show } from 'solid-js';
import type { ConversationResponse } from '../interfaces/Conversation';
import type { SetStoreFunction } from 'solid-js/store';
import type { ChatStore } from '../interfaces/Chat';
import type { User } from '../interfaces/User';

export default function ConversationList(props: {
  conversations: ConversationResponse[];
  setStoreChat: SetStoreFunction<ChatStore>;
  fetchConversations: Function;
  currentChannelId: string;
  user: User | null;
}) {
  const currentChannelId = () => props.currentChannelId;

  onMount(() => {
    props.fetchConversations();
  });

  const handlerSwitchChannel = (e: Event) => {
    const channelId = (e.currentTarget as HTMLElement).dataset.channelId;
    props.setStoreChat('currentChannelId', () => channelId as string);
  };

  return (
    <aside class="w-full md:w-1/4 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
      <h2 class="text-xl font-bold mb-4">Conversations</h2>
      <ul class="space-y-2">
        <For each={props.conversations}>
          {(conversation) => (
            <li
              class={`flex items-center justify-between hover:bg-gray-300 p-2 rounded cursor-pointer ${
                conversation.channel_id === currentChannelId()
                  ? 'bg-indigo-500 text-white self-end ml-auto hover:bg-indigo-700'
                  : ''
              }`}
              on:click={handlerSwitchChannel}
              data-channel-id={conversation.channel_id}
            >
              <div class="flex items-center mr-3">
                <div
                  class="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-400 text-white font-bold select-none"
                  aria-label="Profil initial"
                >
                  {conversation.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <div class="flex flex-col flex-grow">
                <span class="font-medium truncate">{conversation.name}</span>
                <Show when={conversation.is_group}>
                  <span class="text-xs text-gray-600 mt-0.3">
                    {conversation.members_count + ' Membres'}
                  </span>
                </Show>
              </div>

              <div class="flex items-center gap-2">
                <Show when={!conversation.is_group}>
                  <span class="h-3 w-3 rounded-full bg-green-500"></span>
                </Show>

                <Show
                  when={
                    conversation.newMessages && conversation.newMessages > 0
                  }
                >
                  <span class="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {conversation.newMessages}
                  </span>
                </Show>
              </div>
            </li>
          )}
        </For>
      </ul>
    </aside>
  );
}
