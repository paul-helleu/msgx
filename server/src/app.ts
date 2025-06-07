import express from 'express';
import router from './routes';
import sequelize from './database/sequelize.ts';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use('/api', router);

try {
  await sequelize.sync();
  console.log('Database synchronized');
} catch (error) {
  console.error('Error synchronizing database');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT);
