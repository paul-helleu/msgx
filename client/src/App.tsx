import { Route, Router } from '@solidjs/router';
import Login from './pages/Login';
import Conversation from './pages/Conversation';
import { AuthProvider } from './components/AuthContext';
import Register from './pages/Register';
import AuthLoader from './components/AuthLoader';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />

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
