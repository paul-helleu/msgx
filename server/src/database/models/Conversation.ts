<<<<<<< HEAD
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
  declare createdAt?: CreationOptional<Date>;
=======
import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.ts";

class Conversation extends Model {
  public id!: number;
  public channel_id!: number;
  static associate(models: any) {
    this.hasMany(models.Message, { foreignKey: "conv_id" });
  }
>>>>>>> 0ed518c0d7ed3533a281385c21847b1604254715
}

Conversation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    channel_id: {
<<<<<<< HEAD
      type: DataTypes.STRING,
=======
      type: DataTypes.INTEGER,
>>>>>>> 0ed518c0d7ed3533a281385c21847b1604254715
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "conversations",
  }
);

export default Conversation;
