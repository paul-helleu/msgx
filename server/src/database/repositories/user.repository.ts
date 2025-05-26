import { User } from "../models";

export default {
  async findByUsername(username: string) {
    return User.findOne({
      where: {
        username,
      },
    });
  },
  async findByUserId(id: number) {
    return User.findOne({
      where: {
        id,
      },
    });
  },
};
