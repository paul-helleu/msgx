import './Conversation.css';
import { For } from 'solid-js';
import { io } from 'socket.io-client';
import { createStore } from 'solid-js/store';
import { useAuth } from '../components/AuthContext';

interface Message {
  sender: string;
  receiver: string;
  content: string;
}

export default function Conversation() {
  const { user } = useAuth();
  const serverUri: string = 'http://127.0.0.1:3300';
  const socket = io(serverUri);

  const username = 'Bob'; // destinataire
  const msgExample: Message = {
    content: 'Hello BOB',
    receiver: 'Bob',
    sender: username,
  };

  const evIdentifier = `message/@${username.toLowerCase()}`;
  const [store, setStore] = createStore({
    messages: [] as Message[],
  });

  const sendMsg = (msg: Message) => {
    socket.emit(evIdentifier, msg);
  };

  socket.on(evIdentifier, (msg) => {
    setStore('messages', (messages) => [...messages, msg]);
  });

  return (
    <div>
      <div>
        <h1>
          Welcome <b>{user()?.username}</b> to MSGx you have a new message
        </h1>
        <h2>Token: {localStorage.getItem('token')}</h2>
      </div>

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
      <input type="text" name="message" />
      <button
        type="button"
        onclick={() => {
          sendMsg(msgExample);
        }}
      >
        Envoyer
      </button>
    </div>
  );
}
