import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Enterprise from './Enterprise';

class Module extends Model {
  public id!: string;
  public name!: string;
  public type!: 'dgi' | 'items' | 'digital';
  public config!: object;
  public enterpriseId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Module.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('dgi', 'items', 'digital'),
    allowNull: false
  },
  config: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  sequelize,
  modelName: 'Module'
});

Module.belongsTo(Enterprise);
Enterprise.hasMany(Module);

export default Module;