<<<<<<< HEAD
import { User } from "../models";
=======
import User from "../models/User";
>>>>>>> 0ed518c0d7ed3533a281385c21847b1604254715

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
