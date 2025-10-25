import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';

export type PasswordResetTokenInstance = Model<
  {
    idPasswordResetToken: number;
    userId: number;
    tokenHash: string;
    expiresAt: Date;
    usedAt: Date | null;
    createdAt: Date;
  },
  {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
  }
>;

export type PasswordResetTokenModel = ModelCtor<PasswordResetTokenInstance>;

export const initPasswordResetTokenModel = (
  sequelize: Sequelize
): PasswordResetTokenModel => {
  const passwordResetToken = sequelize.define<PasswordResetTokenInstance>(
    'PasswordResetToken',
    {
      idPasswordResetToken: {
        field: 'idPasswordResetToken',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        field: 'idUsuario',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      tokenHash: {
        field: 'tokenHash',
        type: DataTypes.STRING(255),
        allowNull: false
      },
      expiresAt: {
        field: 'expiresAt',
        type: DataTypes.DATE,
        allowNull: false
      },
      usedAt: {
        field: 'usedAt',
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      createdAt: {
        field: 'createdAt',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'passwordResetToken',
      timestamps: false,
      freezeTableName: true
    }
  );

  return passwordResetToken;
};
