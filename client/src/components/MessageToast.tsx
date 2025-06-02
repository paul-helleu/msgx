import { createSignal, createEffect, onCleanup } from 'solid-js';
import toast, { type Toast } from 'solid-toast';

export function showNotifMessageToast(message: any) {
  const duration = 3000;
  toast.custom(
    (t) => {
      const [life, setLife] = createSignal(100);
      const startTime = Date.now();
      createEffect(() => {
        if (t.paused) return;
        const interval = setInterval(() => {
          const diff = Date.now() - startTime - t.pauseDuration;
          setLife(100 - (diff / duration) * 100);
        }, 10);
        onCleanup(() => clearInterval(interval));
      });

      return (
        <MessageToast t={t} life={life()} message={message} toast={toast} />
      );
    },
    {
      duration,
    }
  );
}

export default function MessageToast(props: {
  t: Toast;
  life: number;
  toast: typeof toast;
  message: { username: string; content: string };
}) {
  return (
    <div
      class={`${
        props.t.visible ? 'animate-enter' : 'animate-leave'
      } bg-gradient-to-r from-cyan-600 to-blue-500 shadow-lg rounded-md p-4 min-w-[350px] flex flex-col`}
    >
      <div class="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 text-cyan-200 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7 8h10M7 12h6m-3 8a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"
          />
        </svg>

        <div class="flex-1 flex flex-col">
          <span class="text-white font-semibold">{props.message.username}</span>
          <span class="text-blue-100 text-sm truncate">
            {props.message.content}
          </span>
        </div>

        <button
          onClick={() => props.toast.dismiss(props.t.id)}
          aria-label="Close notification"
          class="text-blue-200 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <div class="relative mt-3 h-1 rounded-full bg-blue-900 overflow-hidden">
        <div
          class="absolute left-0 top-0 h-1 bg-blue-300 transition-[width]"
          style={{ width: `${props.life}%` }}
        ></div>
      </div>
    </div>
  );
}
