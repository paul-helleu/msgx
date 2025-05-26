import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import sequelize from "../sequelize.ts";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare password: string;
<<<<<<< HEAD
  declare createdAt?: CreationOptional<Date>;
=======

  static associate(models: any) {
    this.hasMany(models.Conversation, { foreignKey: "user_a" });
    this.hasMany(models.Conversation, { foreignKey: "user_b" });
    this.hasOne(models.Message, { foreignKey: "sender_id" });
  }
>>>>>>> 0ed518c0d7ed3533a281385c21847b1604254715
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
