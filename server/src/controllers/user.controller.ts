import type { Response } from 'express';
import { User } from '../models';
import { UserService } from '../services/user.service';
import type { AuthenticatedRequest } from '../api/auth';
import { Op } from 'sequelize';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getCurrent(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await User.findOne({ where: { id: userId } });
      if (user) {
        const { id, username, color } = user.toJSON();
        res.json({ id, username, color });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  }

  public async searchUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { search } = req.body;

      const whereClause: any = {
        id: { [Op.ne]: userId },
      };
      if (search) {
        whereClause.username = {
          [Op.iLike]: `%${search}%`,
        };
      }

      const users = await User.findAll({
        where: whereClause,
        order: [['username', 'ASC']],
        limit: 10,
        attributes: ['id', 'username', 'color'],
      });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  }
}
