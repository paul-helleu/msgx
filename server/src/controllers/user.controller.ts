import type { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ApiError } from '../utils/errors';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getCurrent(req: Request, res: Response, _next: NextFunction) {
    const user = await this.userService.getById(req.user!.id);
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }

    const { id, username, color } = user.toJSON();
    res.json({ id, username, color });
  }

  public async searchUsers(req: Request, res: Response, _next: NextFunction) {
    const { search } = req.body;
    if (search === null) {
      throw new ApiError(400, 'Search query is required', 'INVALID_SEARCH');
    }

    const users = await this.userService.searchUsers(search, req.user!.id);
    res.status(200).json(users);
  }
}
