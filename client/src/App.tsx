import { Route, Router } from '@solidjs/router';
import Login from './pages/Login';
import Conversation from './pages/Conversation';

export default function App() {
  return (
    <Router>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/conversation" component={Conversation} />
    </Router>
  );
}
