import { createSignal, createResource, onMount } from 'solid-js';
import type { User } from '../interfaces/User';
import ProfilePicture from './ProfilePicture';
import { Select } from '@thisbeyond/solid-select';
import '@thisbeyond/solid-select/style.css';
import { useNavigate } from '@solidjs/router';
import { useApp } from './AppContext';

export default function ConversationCreation(props: {
  setIsOpen: (value: boolean) => void;
}) {
  const [search, setSearch] = createSignal('');
  const [selectedUsers, setSelectedUsers] = createSignal<any[]>([]);
  const navigate = useNavigate();
  const { switchConversation } = useApp();

  onMount(() => {
    setSearch('');
  });
  const fetchUsers = async (term: string) =>
    fetch('http://localhost:3000/api/auth/users', {
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
      name: recipients.length > 1 ? 'Nouvelle conversation' : '',
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
    if (response.status == 202) {
      props.setIsOpen(false);
      switchConversation(data.conversation.channel_id as string);
      navigate(`/conversation/${data.conversation.channel_id}`);
    }
    if (response.ok) {
      console.log('✅ Conversation créée :', data.conversation);
    }
  };
  return (
    <div class="h-64 flex items-end flex-col">
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
            <ProfilePicture size="6" username={item.label} color={item.color} />
            <span>{item.label}</span>
          </div>
        )}
      />
      <button
        class="bg-zinc-800 hover:bg-zinc-600 text-white px-3 py-1 rounded transition mt-48"
        onClick={handleSubmit}
        disabled={selectedUsers().length === 0}
      >
        Créer la conversation
      </button>
    </div>
  );
}
