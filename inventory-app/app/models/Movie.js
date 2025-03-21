const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Movie = sequelize.define("Movie", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: "movies",
    freezeTableName: true,
});

module.exports = Movie;
