import express, { type Request, type Response } from 'express';
import router from './routes';
import sequelize from './database/sequelize.ts';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/authenticate.middleware.ts';
import { authHelpers } from './middlewares/auth.helpers.middleware.ts';
import { logger } from './config/logger.config.ts';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5138',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(authenticate);
app.use(authHelpers);

app.use('/api', router);

app.use((err: Error, _req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

try {
  await sequelize.sync();
} catch (error) {
  logger.error(`Database connection failed: ${(error as Error).message}`);
}

const PORT = process.env.SERVER_API_PORT || 3000;
app.listen(PORT);
