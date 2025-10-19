import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { TitleAttributes, TitleCreationAttributes } from '../types/title';

export type TitleInstance = Model<TitleAttributes, TitleCreationAttributes>;
export type TitleModel = ModelCtor<TitleInstance>;

export const initTitleModel = (sequelize: Sequelize): TitleModel => {
  const title = sequelize.define<TitleInstance>(
    'Title',
    {
      idTitle: {
        field: 'idTitulo',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      studyPlanId: {
        field: 'tituloIdPlanEstudio',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      titleName: {
        field: 'tituloNombre',
        type: DataTypes.STRING(255),
        allowNull: true
      },
      titleTypeId: {
        field: 'tituloIdTituloTipo',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      requestTypeId: {
        field: 'tituloIdSolicitudTipo',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      titleStatusId: {
        field: 'tituloIdTituloEstado',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'titulo',
      timestamps: false,
      freezeTableName: true
    }
  );

  return title;
};
