import express from 'express';
import dotenv from 'dotenv';
import router from '../database/routes/index.ts';
import sequelize from '../database/sequelize.ts';
import cors from 'cors';
import User from '../database/models/User.ts';
import { compareSync } from 'bcrypt-ts';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', router);
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.post('/api/login', async (req, res) => {
  const { username, password }: { username: string; password: string } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    res.status(404).json({ message: 'This username does not exist.' });
  }
  else{
    const isValid = compareSync(password, user.dataValues.password);
    if (!isValid) {
      res.status(403).json({ message: 'Incorrect password' });
    }
  }
  res.status(200).json({ message: 'Authentification Succedeed' });
})

// Sync Sequelize
sequelize.sync().then(() => {
  console.log('Base de données synchronisée');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});