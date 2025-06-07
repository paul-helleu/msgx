import { Sequelize, type Dialect } from 'sequelize';
import { logger } from '../config/logger.config';

const DB_NAME = process.env.DB_NAME as string;
const DB_USER = process.env.DB_USER as string;
const DB_PASSWORD = process.env.DB_PASSWORD as string;
const DB_HOST = process.env.DB_HOST as string;
const DB_PORT = Number(process.env.DB_PORT);
const DB_DIALECT = process.env.DB_DIALECT as Dialect;

const NODE_ENV = process.env.NODE_ENV;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: (msg) => {
    if (NODE_ENV === 'development') {
      logger.debug(msg);
    } else if (NODE_ENV === 'production') {
      logger.info(msg);
    } else if (NODE_ENV === 'test') {
      // Silence
    }
  },
});

export default sequelize;
