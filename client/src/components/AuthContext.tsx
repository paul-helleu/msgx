import { createContext, useContext } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';

export interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>();

export function AuthProvider(props: { children: JSX.Element }) {
  async function login(username: string, password: string) {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    console.log(res.status);
    if (!res.ok) throw new Error('Login failed');

    const { token } = await res.json();
    localStorage.setItem('token', token);
  }

  return (
    <AuthContext.Provider value={{ login }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
