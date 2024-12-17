import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Enterprise from './Enterprise';
import User from './User';

class File extends Model {
  public id!: string;
  public name!: string;
  public type!: string;
  public path!: string;
  public size!: number;
  public moduleId!: string;
  public enterpriseId!: string;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

File.init({
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
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  moduleId: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'File'
});

File.belongsTo(Enterprise);
File.belongsTo(User);

export default File;