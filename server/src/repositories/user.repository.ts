import { Op } from 'sequelize';
import { User } from '../models';

export class UserRepository {
  public async findByUsername(username: string) {
    return await User.findOne({
      where: {
        username,
      },
    });
  }

  public async findById(id: number) {
    return await User.findByPk(id);
  }

  public async searchWithExcludeUserId(
    search: string,
    excludeUserId: number,
    limit: number | undefined = undefined
  ) {
    return await User.findAll({
      where: {
        id: { [Op.ne]: excludeUserId },
        username: {
          [Op.iLike]: `%${search}%`,
        },
      },
      order: [['username', 'ASC']],
      limit,
      attributes: ['id', 'username', 'color'],
    });
  }
}
