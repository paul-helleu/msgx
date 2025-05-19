import { DataTypes } from "sequelize"
import sequelize from ".."

const User = sequelize.define(
    'User', 
    {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        username: { type: DataTypes.STRING }
    },
    { timestamps: false }
)

export default User