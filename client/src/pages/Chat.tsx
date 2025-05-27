import ConversationList from '../components/ConversationList';
import type { Message } from '../interfaces/Message';
import ConversationV2 from './ConversationV2';

export default function App() {
  const messages: Message[] = [
    {
      id: 1,
      sender: 'Alice',
      content: 'Salut !',
      timestamp: new Date(Date.now() - 5000),
    },
    {
      id: 2,
      sender: 'Moi',
      content: 'Hey ! Ça va ?',
      timestamp: new Date(Date.now() - 1000),
    },
  ];
  return (
    <div class="flex flex-col md:flex-row h-screen">
      {/* Sidebar contacts */}
      <ConversationList />

      {/* Main chat area */}
      <ConversationV2 />
    </div>
  );
}
