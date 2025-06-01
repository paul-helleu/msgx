import { For, onMount, Show } from 'solid-js';
import type { ConversationResponse } from '../interfaces/Conversation';
import type { SetStoreFunction } from 'solid-js/store';
import type { ChatStore } from '../interfaces/Chat';
import type { User } from '../interfaces/User';
import ProfilePicture from './ProfilePicture';

export default function ConversationList(props: {
  conversations: ConversationResponse[];
  setStoreChat: SetStoreFunction<ChatStore>;
  currentChannelId: string;
  user: User | null;
}) {
  const currentChannelId = () => props.currentChannelId as string;
  const conversations = () => props.conversations as ConversationResponse[];

  onMount(async () => {
    fetch(`http://localhost:3000/api/auth/conversations`, {
      headers: {
        authorization: `${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        res.json().then((json) => {
          props.setStoreChat(
            'conversations',
            () => json as ConversationResponse[]
          );
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
    console.log(conversations());
    props.setStoreChat('currentChannelId', () => channelId as string);
  }

  return (
    <aside class="w-full md:w-1/4 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
      <h2 class="text-xl font-bold mb-4">Conversations</h2>
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
              <div class="flex items-center mr-3">
                <ProfilePicture
                  username={conversation.name.charAt(0).toUpperCase()}
                  is_group={conversation.is_group}
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
              <Show when={!conversation.is_group}>
                <span class="h-3 w-3 rounded-full bg-green-500 ml-3"></span>
              </Show>
            </li>
          )}
        </For>
      </ul>
    </aside>
  );
}
