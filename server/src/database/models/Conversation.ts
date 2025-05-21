import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize.ts';

class Conversation extends Model {
  public id!: number;
  public user_a!: number;
  public user_b!: number;
  static associate(models: any) {
    this.hasMany(models.Message, { foreignKey: 'conv_id'});
  }
}

Conversation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_a: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    user_b: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'conversations',
  }
);

export default Conversation;
