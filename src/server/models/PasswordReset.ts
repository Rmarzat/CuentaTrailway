import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class PasswordReset extends Model {
  public id!: string;
  public code!: string;
  public userId!: string;
  public expiresAt!: Date;
  public used!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PasswordReset.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'PasswordReset'
});

PasswordReset.belongsTo(User);
User.hasMany(PasswordReset);

export default PasswordReset;