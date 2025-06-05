import { For, onMount, Show } from 'solid-js';
import type { ConversationResponse } from '../interfaces/Conversation';
import type { User } from '../interfaces/User';
import ProfilePicture from './ProfilePicture';
import { useNavigate } from '@solidjs/router';
import { useApp } from './AppContext';
import type { Socket } from 'socket.io-client';

export default function ConversationList(props: {
  conversations: ConversationResponse[];
  user: User | null;
  channelId: string;
  socket: Socket;
}) {
  const conversations = () => props.conversations as ConversationResponse[];
  const navigate = useNavigate();
  const { storeChat, setStoreChat, userStatus, switchConversation } = useApp();

  onMount(async () => {
    fetch(`http://localhost:3000/api/auth/conversations`, {
      headers: {
        authorization: `${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        res.json().then((json) => {
          setStoreChat('conversations', () => json as ConversationResponse[]);
          const fromUrl = json.find(
            (c: any) => c.channel_id === props.channelId
          );
          if (fromUrl) switchConversation(fromUrl.channel_id);
          else if (json[0]) switchConversation(json[0].channel_id);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    props.socket.on('new_conversation', (conversation) => {
      setStoreChat('conversations', (prev) => [conversation, ...prev]);
    });
  });

  async function handleRswitchChannel(e: Event) {
    const channelId = (e.currentTarget as HTMLElement).dataset.channelId;
    switchConversation(channelId as string);
    setStoreChat('conversations', (convs) => {
      return convs.map((conv) => ({ ...conv, newMessagesCount: 0 }));
    });
    navigate(`/conversation/${channelId}`);
  }

  return (
    <div class="flex flex-col md:flex-col h-screen p-4 m-h-screen pb-[70px]">
      <h2 class="text-xl font-bold mb-4">Conversations</h2>
      <ul class="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
        <For each={conversations()}>
          {(conversation) => (
            <li
              class={`flex items-center justify-between hover:bg-gray-300 p-2 rounded cursor-pointer ${
                conversation.channel_id ===
                storeChat.currentConversation?.channel_id
                  ? 'bg-zinc-900 text-white self-end ml-auto hover:bg-zinc-700'
                  : ''
              }`}
              on:click={handleRswitchChannel}
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
                      conversation.channel_id ===
                      storeChat.currentConversation?.channel_id
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
                  <span
                    class={`h-3 w-3 rounded-full ${
                      userStatus[conversation.name] === 'online'
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}
                    title={
                      userStatus[conversation.name] === 'online'
                        ? 'En ligne'
                        : 'Hors ligne'
                    }
                  ></span>
                </Show>

                <Show
                  when={
                    conversation.newMessagesCount &&
                    conversation.newMessagesCount > 0
                  }
                >
                  <span class="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {conversation.newMessagesCount}
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
