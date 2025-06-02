import { Route, Router } from '@solidjs/router';
import Login from './pages/Login';
import { AuthProvider } from './components/AuthContext';
import Register from './pages/Register';
import AuthLoader from './components/AuthLoader';
import Chat from './pages/Chat';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route
          path="/conversation2"
          component={() => (
            <AuthLoader>
              <Chat />
            </AuthLoader>
          )}
        />
        <Route
          path="/conversation/:channelId"
          component={() => (
            <AuthLoader>
              <Chat />
            </AuthLoader>
          )}
        />
        <Route
          path="/conversation/"
          component={() => (
            <AuthLoader>
              <Chat />
            </AuthLoader>
          )}
        />
        <Route
          path="/"
          component={() => (
            <AuthLoader>
              <Chat />
            </AuthLoader>
          )}
        />
      </Router>
    </AuthProvider>
  );
}
