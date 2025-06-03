import type { ConversationResponse } from '../interfaces/Conversation';
import ModalComponent from './ModalComponent';
import ProfilePicture from './ProfilePicture';
import { createSignal } from 'solid-js';

export default function ConversationHeader(props: {
  conversation?: ConversationResponse;
}) {
  const [showModal, setShowModal] = createSignal(false);

  return (
    <div class="flex items-center justify-between px-4 py-2 text-sm bg-gray-100">
      <div class="flex items-center">
        <ProfilePicture
          username={props.conversation?.name ?? ''}
          isGroup={props.conversation?.is_group}
          color={props.conversation?.color}
        />
        <h2 class="font-medium text-gray-800 truncate ml-2">
          {props.conversation?.name ?? ''}
        </h2>
      </div>
      <button
        class="text-zinc-600 hover:text-zinc-800 transition text-xs font-medium"
        onClick={() => setShowModal(true)}
      >
        Voir les membres
      </button>
      <ModalComponent
        isOpen={showModal()}
        setIsOpen={setShowModal}
        title={`${
          props.conversation?.members_count ?? 2 > 2 ? 'Membres' : 'Membre'
        } de la conversation`}
        children={
          <>
            <ul class="text-sm space-y-2">
              {props.conversation?.Users.map((user) => (
                <li class="flex items-center gap-2">
                  <ProfilePicture
                    username={user.username}
                    color={user?.color}
                  />
                  <span>{user.username}</span>
                </li>
              )) ?? <li>Aucun membre</li>}
            </ul>
          </>
        }
      ></ModalComponent>
    </div>
  );
}
