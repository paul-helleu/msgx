import { Show } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import { AiFillCloseSquare } from 'solid-icons/ai';

export default function ModalComponent(props: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: JSX.Element;
  title?: string;
}) {
  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => props.setIsOpen(false)}
      >
        <div
          class="bg-white p-4 rounded shadow-lg w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <header class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">{props.title ?? 'Modal'}</h2>{' '}
            <AiFillCloseSquare
              onClick={() => props.setIsOpen(false)}
              class="text-gray-700 hover:text-gray-500 text-2xl font-bold leading-none"
            />
          </header>
          <div>{props.children}</div>
        </div>
      </div>
    </Show>
  );
}
