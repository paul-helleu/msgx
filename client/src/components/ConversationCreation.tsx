import { createSignal, createResource, onMount, Show } from 'solid-js';
import type { User } from '../interfaces/User';
import ProfilePicture from './ProfilePicture';
import { Select } from '@thisbeyond/solid-select';
import '@thisbeyond/solid-select/style.css';
import { useNavigate } from '@solidjs/router';
import { useApp } from './AppContext';
import type { Socket } from 'socket.io-client';
import toast from 'solid-toast';

const colorOptions = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
].map((color) => ({ label: color, value: color }));

export default function ConversationCreation(props: {
  setIsOpen: (value: boolean) => void;
  socket: Socket;
}) {
  const [search, setSearch] = createSignal('');
  const [selectedUsers, setSelectedUsers] = createSignal<any[]>([]);
  const [groupName, setGroupName] = createSignal('');
  const [groupColor, setGroupColor] = createSignal<{
    label: string;
    value: string;
  }>();
  const navigate = useNavigate();
  const { switchConversation } = useApp();

  const { setStoreChat } = useApp();

  onMount(() => {
    setSearch('');
  });

  const fetchUsers = async (term: string) =>
    fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ search: term }),
    }).then((res) => (res.ok ? res.json() : []));

  const [users] = createResource(search, fetchUsers);

  const mappedUsers = () => {
    const selectedIds = new Set(selectedUsers().map((u) => u.value));
    return (users() || [])
      .filter((u: User) => !selectedIds.has(u.id))
      .map((u: User) => ({
        label: u.username,
        value: u.id,
        color: u.color,
      }));
  };

  const handleSubmit = async () => {
    const selected = selectedUsers();
    if (!selected.length) return;

    const recipients = selected.map((user) => user.label);
    const payload = {
      recipients,
      name: groupName(),
      color: groupColor()?.value ?? 'bg-blue-500',
    };

    const response = await fetch(
      'http://localhost:3000/api/conversations/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (response.status == 202 || response.status == 201) {
      const conversation = data.conversation.conversation;

      props.socket.emit('conversationCreated', {
        participants: recipients,
        conversation,
      });

      setStoreChat('conversations', (prev) => [conversation, ...prev]);

      props.setIsOpen(false);
      switchConversation(conversation.channel_id);
      navigate(`/conversation/${conversation.channel_id}`);
    } else {
      toast.error(
        'Error while sending the message, verify your internet connection!'
      );
    }
  };

  return (
    <div class="min-h-[22rem] w-full flex flex-col justify-between p-2 space-y-4 bg-white rounded">
      <div class="space-y-3">
        <Show when={selectedUsers().length > 1}>
          <input
            type="text"
            value={groupName()}
            onInput={(e) => setGroupName(e.currentTarget.value)}
            placeholder="Nom du groupe"
            class="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />

          <Select
            class="w-full"
            options={colorOptions}
            onChange={setGroupColor}
            placeholder="Couleur du groupe"
            format={(item) => (
              <div class="flex items-center gap-2">
                <div class={`w-4 h-4 rounded-full ${item.value}`}></div>
                <span class="text-sm">{item.label}</span>
              </div>
            )}
          />
        </Show>

        <Select
          class="w-full"
          multiple
          options={(input) => {
            setSearch(input);
            return mappedUsers();
          }}
          onChange={setSelectedUsers}
          format={(item) => (
            <div class="flex items-center gap-2">
              <ProfilePicture
                size="6"
                username={item.label}
                color={item.color}
              />
              <span>{item.label}</span>
            </div>
          )}
        />
      </div>

      <div class="pt-4">
        <button
          class="bg-zinc-800 hover:bg-zinc-600 text-white px-4 py-2 rounded text-sm transition disabled:opacity-50"
          onClick={handleSubmit}
          disabled={selectedUsers().length === 0}
        >
          Créer la conversation
        </button>
      </div>
    </div>
  );
}
