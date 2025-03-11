const express = require("express");
const sequelize = require("./app/config/database");
const movieRoutes = require("./app/routes/movieRoutes"); // Mise à jour du nom du fichier
const swaggerDocs = require("./app/config/swagger");

require("dotenv").config();

const app = express();
swaggerDocs(app);
app.use(express.json());

app.use("/api/movies", movieRoutes);

const PORT = process.env.PORT || 8000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connexion à la base de données réussie !");

        app.listen(PORT, () => {
            console.log(`Serveur en écoute sur http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Impossible de se connecter à la base :", error);
    }
})();
