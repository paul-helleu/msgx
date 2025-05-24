import './Register.css';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

export default function Register() {
  const passwordLength = 4;
  const {
    register,
    setPasswordError,
    passwordError,
    loginError,
    error,
    setError,
  } = useAuth();

  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [passwordConfirm, setPasswordConfirm] = createSignal('');

  const navigate = useNavigate();

  async function handleRegister(e: Event) {
    e.preventDefault();
    if (password() != passwordConfirm()) {
      setError('* Les mots de passe doivent être similaires');
      setPasswordError('red');
    } else {
      if (password().length < passwordLength) {
        setError(
          `* Le mot de passe doit faire plus de ${passwordLength} caractères`
        );
        setPasswordError('red');
      } else {
        try {
          await register(username(), password());
          navigate('/conversation');
        } catch (err) {
          setError("* Échec de l'inscription");
        }
      }
    }
  }
  return (
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="hidden text-red-400 text-gray-400 outline-red-400 text-red-900"></div>
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-20 w-auto" src="logo.svg" alt="Logo MSGx" />
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Inscrivez-vous à MSGx
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" onSubmit={handleRegister}>
          <div>
            <label
              for="username"
              class={`block text-sm/6 font-medium text-${loginError()}-600`}
            >
              Nom d'utilisateur
            </label>
            <div class="mt-2">
              <input
                type="text"
                name="username"
                id="username"
                onInput={(e) => setUsername(e.currentTarget.value)}
                required
                class={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-${loginError()}-400 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class={`block text-sm/6 font-medium text-${passwordError()}-600`}
              >
                Mot de passe
              </label>
            </div>
            <div class="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                onInput={(e) => setPassword(e.currentTarget.value)}
                autocomplete="current-password"
                required
                class={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-${passwordError()}-400 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
              />
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <label
                for="confirmPassword"
                class={`block text-sm/6 font-medium text-${passwordError()}-600`}
              >
                Confirmation du Mot de passe
              </label>
            </div>
            <div class="mt-2">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                onInput={(e) => setPasswordConfirm(e.currentTarget.value)}
                autocomplete="current-confirmPassword"
                required
                class={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-${passwordError()}-400 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
              />
            </div>
          </div>
          <p class="-mt-4 mb-12 text-red-600">{error()}</p>
          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              S'inscrire
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Déjà un compte ?
          <a
            href="/login"
            class="font-semibold text-indigo-600 hover:text-indigo-500 pl-2"
          >
            Connectez-vous ici
          </a>
        </p>
      </div>
    </div>
  );
}
