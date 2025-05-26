import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.ts";

class Conversation extends Model {
  public id!: number;
  public channel_id!: number;
  static associate(models: any) {
    this.hasMany(models.Message, { foreignKey: "conv_id" });
  }
}

Conversation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    channel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "conversations",
  }
);

export default Conversation;
