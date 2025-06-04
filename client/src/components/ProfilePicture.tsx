import { FaSolidUserGroup } from 'solid-icons/fa';

export default function ProfilePicture(props: {
  username: string;
  isGroup?: boolean | false;
  color?: string;
  size?: string;
}) {
  return (
    <div
      class={`flex items-center justify-center h-${props?.size ?? 8} w-${
        props?.size ?? 8
      } rounded-full text-white font-bold select-none ${props.color}`}
      aria-label="Profil initial"
    >
      {props.isGroup ? (
        <FaSolidUserGroup />
      ) : (
        props.username.charAt(0).toUpperCase()
      )}
    </div>
  );
}
