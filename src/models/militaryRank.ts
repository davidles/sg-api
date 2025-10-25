import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { MilitaryRankAttributes, MilitaryRankCreationAttributes } from '../types/militaryRank';

export type MilitaryRankInstance = Model<MilitaryRankAttributes, MilitaryRankCreationAttributes>;
export type MilitaryRankModel = ModelCtor<MilitaryRankInstance>;

export const initMilitaryRankModel = (sequelize: Sequelize): MilitaryRankModel => {
  const militaryRank = sequelize.define<MilitaryRankInstance>(
    'MilitaryRank',
    {
      idMilitaryRank: {
        field: 'idGrado_Militar',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      militaryRankName: {
        field: 'grado_militarNombre',
        type: DataTypes.STRING(50),
        allowNull: false
      },
      forceId: {
        field: 'idFuerzaMilitar',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'grado_militar',
      timestamps: false,
      freezeTableName: true
    }
  );

  return militaryRank;
};
