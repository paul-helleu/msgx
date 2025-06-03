import type { User } from '../interfaces/User';
import ProfilePicture from './ProfilePicture';
import { BiRegularMessageAdd } from 'solid-icons/bi';
import { FiLogOut } from 'solid-icons/fi';
export default function ProfileFooter(props: { user: User | null }) {
  return (
    <div class="bg-gray-200 p-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <ProfilePicture
          username={props.user?.username ?? 'U'}
          color={props.user?.color}
        />
        <div class="text-gray-800 font-semibold truncate">
          {props.user?.username ?? 'Utilisateur'}
        </div>
      </div>
      <div class="flex">
        <FiLogOut
          onClick={() => {
            console.log('Déconnexion');
          }}
          class="text-2xl hover:text-red-500 text-red-700 ml-6"
        />
        <BiRegularMessageAdd
          onClick={() => {
            console.log('Ajouter une conversation');
          }}
          class="text-2xl hover:text-zinc-600 text-gray-600 ml-6"
        />
      </div>
    </div>
  );
}
