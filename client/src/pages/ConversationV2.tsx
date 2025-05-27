import ConversationList from '../components/ConversationList';
import ChatComponent from '../components/ChatComponent';

export default function ConversationV2() {
  return (
    <div class="flex flex-col md:flex-row h-screen">
      {/* Sidebar contacts */}
      <ConversationList />

      {/* Main chat area */}
      <main class="flex-1 flex flex-col justify-between bg-white p-4">
        <ChatComponent convId={1} />
      </main>
    </div>
  );
}
