import { User } from '../models';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      login?: (user: User) => void;
      logout?: () => void;
      isAuthenticated?: () => boolean;
    }
  }
}
