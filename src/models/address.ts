import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { AddressAttributes, AddressCreationAttributes } from '../types/address';

export type AddressInstance = Model<AddressAttributes, AddressCreationAttributes>;
export type AddressModel = ModelCtor<AddressInstance>;

export const initAddressModel = (sequelize: Sequelize): AddressModel => {
  const address = sequelize.define<AddressInstance>(
    'Address',
    {
      idAddress: {
        field: 'idDireccion',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      street: {
        field: 'direccionCalle',
        type: DataTypes.STRING(50),
        allowNull: true
      },
      streetNumber: {
        field: 'direccionNro',
        type: DataTypes.INTEGER,
        allowNull: true
      },
      cityId: {
        field: 'direccionIdCiudad',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      personId: {
        field: 'direccionIdPersona',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'direccion',
      timestamps: false,
      freezeTableName: true
    }
  );

  return address;
};
