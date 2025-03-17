const express = require("express");
const Movie = require("../models/Movie");
const { Op } = require("sequelize");
const router = express.Router();

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

		res.status(200).json(movies);
	} catch (error) {
		res.status(500).json({ error: "Error while retrieving movies" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const movie = await Movie.findByPk(req.params.id);
		if (!movie) {
			return res.status(404).json({
				error: `Movie with ID ${req.params.id} not found.`,
			});
		}
		res.status(200).json(movie);
	} catch (error) {
		res.status(500).json({ error: "Error while retrieving the movie" });
	}
});

router.post("/", async (req, res) => {
	try {
		const { title, description } = req.body;
		const movie = await Movie.create({ title, description });
		res.status(200).json(movie);
	} catch (error) {
		res.status(400).json({ error: "Error while creating the movie" });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const movie = await Movie.findByPk(req.params.id);
		if (!movie) {
			return res.status(404).json({ error: "Movie not found" });
		}

		await movie.update(req.body);
		res.json(movie);
	} catch (error) {
		res.status(400).json({ error: "Error updating the movie" });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const movie = await Movie.findByPk(req.params.id);
		if (!movie) {
			return res.status(404).json({ error: "Movie not found" });
		}

		await movie.destroy();
		res.status(200).json({
			message:
				`Movie with ID ${req.params.id} has been deleted successfully.`,
		});
	} catch (error) {
		res.status(500).json({ error: "Error deleting the movie" });
	}
});

router.delete("/", async (_req, res) => {
	try {
		await Movie.destroy({ where: {} });
	} catch (error) {
		res.status(500).json({ error: "Error while deleting all movies" });
		res.status(200).json({
			message: "All movies have been deleted successfully.",
		});
	}
});

module.exports = router;
