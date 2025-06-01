export default function ProfilePicture(props: {
  username: string;
  is_group?: boolean | false;
}) {
  if (props.is_group) {
    return (
      <div
        class="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-400 text-white font-bold select-none"
        aria-label="Profil initial"
      >
        <img class="invert w-1/2" src="group.png" />
      </div>
    );
  } else {
    return (
      <div
        class="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-400 text-white font-bold select-none"
        aria-label="Profil initial"
      >
        {props.username.charAt(0).toUpperCase()}
      </div>
    );
  }
}
