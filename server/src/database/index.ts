import { Sequelize } from "sequelize"

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ''
});

export default sequelize