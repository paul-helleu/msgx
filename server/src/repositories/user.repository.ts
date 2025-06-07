import { User } from '../models';

export class UserRepository {
  public async findByUsername(username: string) {
    try {
      const user = await User.findOne({
        where: {
          username,
        },
      });
      return user;
    } catch (error) {
      throw new Error('Error while retrieving user');
    }
  }

  public async findById(id: number) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      throw new Error('Error while retrieving user');
    }
  }
}
