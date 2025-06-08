import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import router from './routes';
import sequelize from './database/sequelize.ts';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/authenticate.middleware.ts';
import { authHelpers } from './middlewares/auth.helpers.middleware.ts';
import { logger } from './config/logger.config.ts';
import type { ApiError } from './utils/errors.ts';
import { errorHandler } from './middlewares/error.middleware.ts';

const app = express();

const SERVER_CLIENT_URI = process.env.SERVER_CLIENT_URI as string;
const SERVER_API_PORT = process.env.SERVER_API_PORT;

app.use(
  cors({
    origin: SERVER_CLIENT_URI,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(authenticate);
app.use(authHelpers);

app.use('/api', router);

app.use(errorHandler);

try {
  await sequelize.sync();
} catch (error) {
  logger.error(`Database connection failed: ${(error as Error).message}`);
}

app.listen(SERVER_API_PORT);
