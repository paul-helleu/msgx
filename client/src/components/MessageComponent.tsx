import type { Message } from '../interfaces/Message';
import ProfilePicture from './ProfilePicture';

export default function MessageComponent(props: {
  sendByMe: boolean;
  msg: Message & { showMeta: boolean };
  showMeta: boolean;
}) {
  return (
    <div
      class={`flex gap-2 mb-1 items-end ${
        props.sendByMe ? 'justify-end flex-row-reverse' : 'justify-start'
      }`}
    >
      {props.showMeta ? (
        <ProfilePicture
          username={props.msg.Sender.username}
          color={props.msg.Sender?.color}
        />
      ) : (
        <div class="w-8" />
      )}
      <div
        class={`flex flex-col w-1/1 ${
          props.sendByMe ? 'items-end' : 'items-start'
        }`}
      >
        {props.showMeta && (
          <div
            class={`text-xs mb-1 mt-3 text-gray-400 ${
              props.sendByMe ? 'text-right' : 'text-left'
            }`}
          >
            <span class="font-bold text-gray-600">
              {props.sendByMe ? 'Moi' : props.msg.Sender.username}
            </span>
            {' · '}
            {new Date(props.msg.createdAt).toLocaleString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
        <div
          class={`px-4 py-2 rounded-lg shadow text-sm break-all whitespace-pre-wrap max-w-[80%] ${
            props.sendByMe
              ? 'bg-zinc-900 text-white rounded-tr-none'
              : 'bg-gray-200 text-gray-900 rounded-tl-none'
          }`}
        >
          <p>{props.msg.content}</p>
        </div>
      </div>
    </div>
  );
}
