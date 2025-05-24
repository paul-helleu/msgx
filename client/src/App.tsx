import { Route, Router } from '@solidjs/router';
import Login from './pages/Login';
import Conversation from './pages/Conversation';
import { AuthProvider } from './components/AuthContext';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/conversation" component={Conversation} />
      </Router>
    </AuthProvider>
  );
}
