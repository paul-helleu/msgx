import { Route, Router } from '@solidjs/router';
import Login from './pages/Login';
import Conversation from './pages/Conversation';
import { AuthProvider } from './components/AuthContext';
import Register from './pages/Register';
import AuthLoader from './components/AuthLoader';
import ConversationV2 from './pages/ConversationV2';

export default function App() {
import './App.css';
import { createSignal, For } from 'solid-js';
import { io } from 'socket.io-client';
import { createStore } from 'solid-js/store';
import type { Message } from './interfaces/Message';

function App() {
  const serverUri = 'http://127.0.0.1:3300';
  const username = 'Bob';
  const destinataire = 'Alice';

  const socket = io(serverUri);

  const [store, setStore] = createStore({
    messages: [] as Message[],
  });
  const [messageContent, setMessageContent] = createSignal<string>('');

  const sendMsg = (msg: Message) => {
    socket.emit('message', msg);
  };

  socket.on(username, (msg) => {
    setStore('messages', (messages) => [...messages, msg]);
  });

  return (
    <AuthProvider>
      <Router>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/conversation2" component={ConversationV2} />

        <Route
          path="/conversation"
          component={() => (
            <AuthLoader>
              <Conversation />
            </AuthLoader>
          )}
        />

        <Route
          path="/"
          component={() => (
            <AuthLoader>
              <Conversation />
            </AuthLoader>
          )}
        />
      </Router>
    </AuthProvider>
    <div>
      <h1>Welcome to MSGx</h1>

      <For each={store.messages}>
        {(item, index) => (
          <div>
            <h3>{item.sender}</h3>
            <div>
              <p>{item.content}</p>
            </div>
          </div>
        )}
      </For>

      <label>Entrer votre message</label>
      <input
        type="text"
        name="message"
        onInput={(e) => setMessageContent(e.target.value)}
      />
      <button
        type="button"
        onclick={() => {
          sendMsg({
            content: messageContent(),
            receiver: username,
            sender: destinataire,
          });
        }}
      >
        Envoyer
      </button>
    </div>
  );
}
