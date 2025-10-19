const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const dbHost = process.env.DB_HOST || '';
const dbPort = Number(process.env.DB_PORT || 0);
const dbName = process.env.DB_NAME || '';
const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASSWORD || '';

module.exports = {
  development: {
    username: dbUser,
    password: dbPassword,
    database: dbName,
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    migrationStorageTableName: 'SequelizeMeta'
  }
};
