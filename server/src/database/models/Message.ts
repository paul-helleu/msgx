import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.ts";

class Message extends Model {
  public id!: number;
  public sender_id!: number;
  public conv_id!: number;
  public date!: Date;
  public content!: Text;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conv_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Conversation",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "messages",
  }
);

export default Message;
