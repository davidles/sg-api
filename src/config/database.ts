import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
const envFallbackPath = path.resolve(process.cwd(), '.env.example');

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (existsSync(envFallbackPath)) {
  dotenv.config({ path: envFallbackPath });
} else {
  dotenv.config();
}

const mysqlUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

let urlHost: string | undefined;
let urlPort: string | undefined;
let urlUser: string | undefined;
let urlPassword: string | undefined;
let urlDatabase: string | undefined;

if (mysqlUrl) {
  try {
    const parsedUrl = new URL(mysqlUrl);
    urlHost = parsedUrl.hostname;
    urlPort = parsedUrl.port;
    urlUser = parsedUrl.username;
    urlPassword = parsedUrl.password;
    urlDatabase = parsedUrl.pathname.replace(/^\//, '');
  } catch (error) {
    urlHost = undefined;
    urlPort = undefined;
    urlUser = undefined;
    urlPassword = undefined;
    urlDatabase = undefined;
  }
}

const dbHost = process.env.DB_HOST || process.env.MYSQL_HOST || urlHost || 'localhost';
const dbPort = Number(process.env.DB_PORT || process.env.MYSQL_PORT || urlPort || 3306);
const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE || urlDatabase || 'secretary-portal';
const dbUser = process.env.DB_USER || process.env.MYSQL_USER || urlUser || 'root';
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || urlPassword || '';

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false
});

export const testDatabaseConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};
