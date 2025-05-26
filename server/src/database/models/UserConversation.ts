import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.ts";

class UserConversation extends Model {
  public id!: number;
  public user_id!: number;
  public conversation_id!: number;
<<<<<<< HEAD
=======
  static associate(models: any) {
    this.hasMany(models.User, { foreignKey: "user_id" });
    this.hasMany(models.Conversation, { foreignKey: "conversation_id" });
  }
>>>>>>> 0ed518c0d7ed3533a281385c21847b1604254715
}

UserConversation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Conversation",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "user_conversations",
  }
);

export default UserConversation;
