import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import sequelize from '../sequelize.ts';
import type { User } from './index.ts';

class Conversation extends Model<
  InferAttributes<Conversation>,
  InferCreationAttributes<Conversation>
> {
  declare id: CreationOptional<number>;
  declare channel_id: string;
  declare name: string;
  declare is_group: boolean;
  declare color?: string;
  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;
  declare Users?: User[];
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
    is_group: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'bg-emerald-500',
    },
  },
  {
    sequelize,
    tableName: 'conversations',
    timestamps: true,
  }
);

export default Conversation;
