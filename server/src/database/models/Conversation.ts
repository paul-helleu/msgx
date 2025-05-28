import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import sequelize from "../sequelize.ts";

class Conversation extends Model<
  InferAttributes<Conversation>,
  InferCreationAttributes<Conversation>
> {
  declare id: CreationOptional<number>;
  declare channel_id: string;
  declare name: string;
  declare createdAt?: CreationOptional<Date>;
}

Conversation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    channel_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "conversations",
  }
);

export default Conversation;
