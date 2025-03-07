const express = require("express");
const Movie = require("../models/Movie");
const { Op } = require("sequelize");
const router = express.Router();

// Get all movie
router.get("/", async (req, res) => {
    try {
        const { title } = req.query;
        let movies;

        if (title) {
            movies = await Movie.findAll({
                where: {
                    title: {
                        [Op.iLike]: `%${String(title)}%`,
                    },
                },
            });
        } else {
            movies = await Movie.findAll();
        }

        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// Get one movie
router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({
                error: `Movie with id ${req.params.id} not found.`,
            });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: "Error while retriving the movie" });
    }
});

// Post create movie
router.post("/", async (req, res) => {
    try {
        const { title, description } = req.body;
        const movie = await Movie.create({ title, description });
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ error: "Error while creating the movie" });
    }
});

// Update a movie
router.put("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        await movie.update(req.body);
        res.json(movie);
    } catch (error) {
        res.status(400).json({
            error: "Error updating the movie",
        });
    }
});

// Delete one movie
router.delete("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: "Produit non trouvé" });
        }

        await movie.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            error: "Erreur lors de la suppression du produit",
        });
    }
});

// Delete all movies
router.delete("/", async (req, res) => {
    try {
        await Movie.destroy({ where: {} });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Error while deleting all movies" });
    }
});

module.exports = router;
