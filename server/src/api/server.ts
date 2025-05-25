import express from "express";
import dotenv from "dotenv";
import router from "../database/routes/index.ts";
import sequelize from "../database/sequelize.ts";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api", router);

// Sync Sequelize
sequelize.sync().then(() => {
  console.log("Base de données synchronisée");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
