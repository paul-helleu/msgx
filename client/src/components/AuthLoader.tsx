import type { JSX } from 'solid-js/jsx-runtime';
import { useAuth } from './AuthContext';
import { useNavigate } from '@solidjs/router';
import { createSignal, onMount, Show } from 'solid-js';

export default function AuthLoader(props: { children: JSX.Element }) {
  const { fetchUserData, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    try {
      await fetchUserData();
    } catch (e) {
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  });

  return (
    <Show when={!loading()} fallback={<div>Chargement...</div>}>
      {user() ? props.children : null}
    </Show>
  );
}
