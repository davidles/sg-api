import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from '../types/user';

export type UserInstance = Model<UserAttributes, UserCreationAttributes>;
export type UserModel = ModelCtor<UserInstance>;

export const initUserModel = (sequelize: Sequelize): UserModel => {
  const user = sequelize.define<UserInstance>(
    'User',
    {
      idUser: {
        field: 'idUsuario',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      personId: {
        field: 'idUsuario_Persona',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      username: {
        field: 'usuarioNombre',
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      accountType: {
        field: 'usuarioCuenta',
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'ACTIVA',
        validate: {
          isIn: [['ACTIVA', 'INACTIVA', 'PENDIENTE']]
        }
      },
      password: {
        field: 'usuarioPasword',
        type: DataTypes.STRING(255),
        allowNull: false
      },
      roleId: {
        field: 'usuarioIdRol',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      }
    },
    {
      tableName: 'usuario',
      timestamps: false,
      freezeTableName: true
    }
  );

  return user;
};
