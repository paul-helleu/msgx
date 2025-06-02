import type { User } from '../interfaces/User';
import ProfilePicture from './ProfilePicture';
import { BiRegularMessageAdd } from 'solid-icons/bi';
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

      <BiRegularMessageAdd
        onClick={() => {
          console.log('Ajouter une conversation');
        }}
        class="text-2xl hover:text-indigo-600 text-gray-600"
      />
    </div>
  );
}
