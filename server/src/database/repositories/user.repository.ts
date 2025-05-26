import User from "../models/User";

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
