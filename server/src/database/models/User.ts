import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.ts";

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  static associate(models: any) {
    this.hasMany(models.Conversation, { foreignKey: "user_a" });
    this.hasMany(models.Conversation, { foreignKey: "user_b" });
    this.hasOne(models.Message, { foreignKey: "sender_id" });
  }
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
