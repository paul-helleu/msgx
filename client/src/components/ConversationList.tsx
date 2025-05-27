import { createSignal, For, onMount } from 'solid-js';
import type { UserConversation } from '../interfaces/types';

export default function ConversationList() {
  const [conversations, setConversations] = createSignal<UserConversation[]>(
    []
  );

  onMount(async () => {
    const res = await fetch(`http://localhost:3000/api/auth/conversations`, {
      headers: {
        authorization: `${localStorage.getItem('token')}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setConversations(data);
    }
  });

  return (
    <aside class="w-full md:w-1/4 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
      <h2 class="text-xl font-bold mb-4">Contacts</h2>
      <ul class="space-y-2">
        <For each={conversations()}>
          {(conversation) => (
            <li class="flex items-center justify-between hover:bg-gray-100 p-2 rounded cursor-pointer">
              <span>{conversation.User.username}</span>
            </li>
          )}
        </For>
      </ul>
    </aside>
  );
}
