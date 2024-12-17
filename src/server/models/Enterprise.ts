import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Enterprise extends Model {
  public id!: string;
  public name!: string;
  public rut!: string;
  public logo?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Enterprise.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rut: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  logo: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Enterprise'
});

Enterprise.belongsToMany(User, { through: 'UserEnterprises' });
User.belongsToMany(Enterprise, { through: 'UserEnterprises' });

export default Enterprise;