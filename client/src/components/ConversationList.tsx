import { createEffect, For, onMount, Show } from 'solid-js';
import type { ConversationResponse } from '../interfaces/Conversation';
import type { SetStoreFunction } from 'solid-js/store';
import type { ChatStore } from '../interfaces/Chat';
import type { User } from '../interfaces/User';
import ProfilePicture from './ProfilePicture';
import { useNavigate } from '@solidjs/router';

export default function ConversationList(props: {
  conversations: ConversationResponse[];
  setStoreChat: SetStoreFunction<ChatStore>;
  fetchConversations: Function;
  currentChannelId: string;
  user: User | null;
  channelId: string;
}) {
  const currentChannelId = () => props.currentChannelId as string;
  const conversations = () => props.conversations as ConversationResponse[];
  const navigate = useNavigate();

  onMount(() => {
    props.fetchConversations();
  });

  const handlerSwitchChannel = (e: Event) => {
    const channelId = (e.currentTarget as HTMLElement).dataset.channelId;
    props.setStoreChat('currentChannelId', () => channelId as string);
  };

  return (
    <div class="flex flex-col md:flex-col h-screen p-4 m-h-screen">
      <h2 class="text-xl font-bold mb-4">Conversations</h2>
      <ul class="space-y-2">
        <For each={conversations()}>
          {(conversation) => (
            <li
              class={`flex items-center justify-between hover:bg-gray-300 p-2 rounded cursor-pointer ${
                conversation.channel_id === currentChannelId()
                  ? 'bg-zinc-900 text-white self-end ml-auto hover:bg-zinc-700'
                  : ''
              }`}
              on:click={handlerSwitchChannel}
              data-channel-id={conversation.channel_id}
            >
              <div class="flex items-center mr-3">
                <ProfilePicture
                  username={conversation.name.charAt(0).toUpperCase()}
                  isGroup={conversation.is_group}
                  color={conversation?.color}
                ></ProfilePicture>
              </div>
              <div class="flex flex-col flex-grow">
                <span class="font-medium truncate">{conversation.name}</span>
                <Show when={conversation.is_group}>
                  <span
                    class={`text-xs text-gray-600 mt-0.3 ${
                      conversation.channel_id === currentChannelId()
                        ? 'text-white'
                        : ''
                    }`}
                  >
                    {conversation.members_count + ' Membre(s)'}
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
    </div>
  );
}
