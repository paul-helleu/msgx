import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
  type Setter,
} from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';

export interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  setLoginError: Setter<string>;
  setPasswordError: Setter<string>;
  setError: Setter<string>;
  loginError: Accessor<string>;
  passwordError: Accessor<string>;
  error: Accessor<string>;
}

const AuthContext = createContext<AuthContextType>();

export function AuthProvider(props: { children: JSX.Element }) {
  const [loginError, setLoginError] = createSignal('gray');
  const [passwordError, setPasswordError] = createSignal('gray');
  const [error, setError] = createSignal('');

  async function login(username: string, password: string) {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login failed');

    const { token } = await res.json();
    localStorage.setItem('token', token);
  }
  async function register(username: string, password: string) {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      setError('Register failed');
      setLoginError('red');
    } else {
      await login(username, password);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        setLoginError,
        setPasswordError,
        loginError,
        passwordError,
        error,
        setError,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
