import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import sequelize from "../sequelize.ts";

class Conversation extends Model {
  public id!: number;
  public user_a!: number;
  public user_b!: number;
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
