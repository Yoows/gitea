const sequelize = require("../config/database");
const Movie = require("../models/Movie");

(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("Base de données synchronisée !");
        process.exit();
    } catch (error) {
        console.error("Erreur lors de la synchronisation :", error);
        process.exit(1);
    }
})();
