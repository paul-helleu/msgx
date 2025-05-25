import { Route, Router } from '@solidjs/router';
import Login from './pages/Login';
import Conversation from './pages/Conversation';
import { AuthProvider } from './components/AuthContext';
import Register from './pages/Register';
import AuthGate from './components/AuthGate';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/" component={AuthGate} />
        <Route path="/conversation" component={Conversation} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Router>
    </AuthProvider>
  );
}
