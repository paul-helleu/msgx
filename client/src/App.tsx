import { Route, Router } from '@solidjs/router';
import Login from './pages/Login';
import Conversation from './pages/Conversation';
import { AuthProvider } from './components/AuthContext';
import Register from './pages/Register';
import AuthLoader from './components/AuthLoader';
import ConversationV2 from './pages/ConversationV2';

export default function App() {
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
  );
}
