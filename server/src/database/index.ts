import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  storage: "",
});

export default sequelize;
