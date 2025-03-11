const express = require("express");
const Movie = require("../models/Movie");
const { Op } = require("sequelize");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the movie
 *         title:
 *           type: string
 *           description: Title of the movie
 *         description:
 *           type: string
 *           description: Description of the movie
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         title: "Inception"
 *         description: "A science fiction movie directed by Christopher Nolan"
 */

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Retrieve all movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter movies by title (case insensitive)
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Movie"
 */
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
		res.status(500).json({ error: "Error while retrieving movies" });
	}
});

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Retrieve a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Details of the movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Movie"
 *       404:
 *         description: Movie not found
 */
router.get("/:id", async (req, res) => {
	try {
		const movie = await Movie.findByPk(req.params.id);
		if (!movie) {
			return res.status(404).json({
				error: `Movie with ID ${req.params.id} not found.`,
			});
		}
		res.json(movie);
	} catch (error) {
		res.status(500).json({ error: "Error while retrieving the movie" });
	}
});

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Movie"
 *       400:
 *         description: Error while creating the movie
 */
router.post("/", async (req, res) => {
	try {
		const { title, description } = req.body;
		const movie = await Movie.create({ title, description });
		res.status(201).json(movie);
	} catch (error) {
		res.status(400).json({ error: "Error while creating the movie" });
	}
});

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update an existing movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Movie"
 *       404:
 *         description: Movie not found
 *       400:
 *         description: Error updating the movie
 */
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

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       204:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Error deleting the movie
 */
router.delete("/:id", async (req, res) => {
	try {
		const movie = await Movie.findByPk(req.params.id);
		if (!movie) {
			return res.status(404).json({ error: "Movie not found" });
		}

		await movie.destroy();
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: "Error deleting the movie" });
	}
});

/**
 * @swagger
 * /api/inventory:
 *   delete:
 *     summary: Delete all movies
 *     tags: [Movies]
 *     responses:
 *       204:
 *         description: All movies deleted successfully
 *       500:
 *         description: Error deleting movies
 */
router.delete("/", async (req, res) => {
	try {
		await Movie.destroy({ where: {} });
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: "Error while deleting all movies" });
	}
});

module.exports = router;
