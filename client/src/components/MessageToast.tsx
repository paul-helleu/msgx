import { createSignal, createEffect, onCleanup } from 'solid-js';
import toast, { type Toast } from 'solid-toast';

export function showNotifMessageToast(message: any) {
  const duration = 3000;
  toast.custom(
    (t) => {
      // Start with 100% life
      const [life, setLife] = createSignal(100);
      const startTime = Date.now();
      createEffect(() => {
        if (t.paused) return;
        const interval = setInterval(() => {
          const diff = Date.now() - startTime - t.pauseDuration;
          setLife(100 - (diff / duration) * 100);
        });

        onCleanup(() => clearInterval(interval));
      });

      return (
        <MessageToast
          t={t}
          life={life()}
          message={message}
          toast={toast}
        ></MessageToast>
      );
    },
    {
      duration: duration,
    }
  );
}
export default function MessageToast(props: {
  t: Toast;
  life: number;
  toast: any;
  message: any;
}) {
  return (
    <div
      class={`${
        props.t.visible ? 'animate-enter' : 'animate-leave'
      } bg-cyan-600 p-3 rounded-md shadow-md min-w-[350px]`}
    >
      <div class="flex gap-2">
        <div class="flex flex-1 flex-col">
          <div class="font-medium text-white">New version available</div>
          <div class="text-sm text-cyan-50">{props.message.content}</div>
        </div>
        <div class="flex items-center">
          <button
            class="px-3.5 h-4/5 tracking-wide font-medium rounded-md text-sm text-white bg-cyan-500 hover:bg-cyan-500/70"
            onClick={() => props.toast.dismiss(props.t.id)}
          >
            CANCEL
          </button>
        </div>
        <div class="flex items-center">
          <button
            class="px-2.5 flex items-center relative h-4/5 tracking-wide rounded-md text-2xl text-white bg-cyan-500/40 hover:bg-cyan-500/20"
            onClick={() => props.toast.dismiss(props.t.id)}
          >
            x
          </button>
        </div>
      </div>
      <div class="relative pt-4">
        <div class="w-full h-1 rounded-full bg-cyan-900"></div>
        <div
          class="h-1 top-4 absolute rounded-full bg-cyan-50"
          style={{ width: `${props.life}%` }}
        ></div>
      </div>
    </div>
  );
}
