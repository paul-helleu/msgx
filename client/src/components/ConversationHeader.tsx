import type { ConversationResponse } from '../interfaces/Conversation';
import ProfilePicture from './ProfilePicture';
import { createSignal } from 'solid-js';

export default function ConversationHeader(props: {
  currentChannelId: string;
  conversations: ConversationResponse[];
}) {
  const conversations = () => props.conversations;
  const [showModal, setShowModal] = createSignal(false);
  const conv = () =>
    conversations().find((el) => el.channel_id === props.currentChannelId);

  return (
    <div class="flex items-center justify-between px-4 py-2 text-sm bg-gray-100">
      <div class="flex items-center">
        <ProfilePicture
          username={conv()?.name ?? ''}
          is_group={conv()?.is_group}
        />
        <h2 class="font-medium text-gray-800 truncate ml-2">
          {conv()?.name ?? ''}
        </h2>
      </div>
      <button
        class="text-indigo-600 hover:text-indigo-800 transition text-xs font-medium"
        onClick={() => setShowModal(true)}
      >
        Voir les membres
      </button>
      {showModal() && (
        <div
          onClick={() => setShowModal(false)}
          class="fixed inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <h3 class="text-lg font-semibold mb-4">
              {conv()!.members_count > 1 ? 'Membres' : 'Membre'} de la
              conversation
            </h3>
            <ul class="text-sm space-y-2">
              {conv()?.Users.map((user) => (
                <li class="flex items-center gap-2">
                  <ProfilePicture username={user.username} />
                  <span>{user.username}</span>
                </li>
              )) ?? <li>Aucun membre</li>}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
