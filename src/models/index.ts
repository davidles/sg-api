import { Sequelize } from 'sequelize';
import { sequelize } from '../config/database';
import { initTitleModel, TitleModel } from './title';

const models = {
  title: initTitleModel(sequelize)
};
type DbModels = typeof models;

export type { DbModels, TitleModel };
export { sequelize };
export default models;
