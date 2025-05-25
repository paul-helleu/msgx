import { useNavigate } from '@solidjs/router';
import { onMount } from 'solid-js';

export default function AuthGate() {
  const navigate = useNavigate();

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const res = await fetch('http://localhost:3000/api/auth/valid_token', {
        headers: {
          authorization: `${token}`,
        },
      });

      if (!res.ok) return navigate('/login');

      navigate('/conversation');
    } catch (e) {
      navigate('/login');
    }
  });

  return <p>Vérification de l'authentification...</p>;
}
