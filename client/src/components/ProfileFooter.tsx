import { createSignal } from 'solid-js';
import type { User } from '../interfaces/User';
import ModalComponent from './ModalComponent';
import ProfilePicture from './ProfilePicture';
import { BiRegularMessageAdd } from 'solid-icons/bi';
import { FiLogOut } from 'solid-icons/fi';
import '@thisbeyond/solid-select/style.css';
import ConversationCreation from './ConversationCreation';
import type { Socket } from 'socket.io-client';
import { redirect, useNavigate } from '@solidjs/router';

export default function ProfileFooter({
  user,
  socket,
}: {
  user: User | null;
  socket: Socket;
}) {
  const [showModal, setShowModal] = createSignal(false);
  const navigate = useNavigate();

  return (
    <>
      <div class="bg-gray-200 p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <ProfilePicture
            username={user?.username ?? 'U'}
            color={user?.color}
          />
          <div class="text-gray-800 font-semibold truncate">
            {user?.username ?? 'Utilisateur'}
          </div>
        </div>
        <div class="flex gap-6 text-2xl">
          <FiLogOut
            onClick={() => {
              fetch('http://localhost:3000/api/logout', {
                method: 'POST',
                credentials: 'include',
              });
              navigate('/login');
            }}
            class="text-red-700 hover:text-red-500"
          />
          <BiRegularMessageAdd
            onClick={() => {
              setShowModal(true);
            }}
            class="text-gray-600 hover:text-zinc-600"
          />
        </div>
      </div>

      <ModalComponent
        isOpen={showModal()}
        setIsOpen={setShowModal}
        title="Créer une conversation"
      >
        <ConversationCreation socket={socket} setIsOpen={setShowModal} />
      </ModalComponent>
    </>
  );
}
