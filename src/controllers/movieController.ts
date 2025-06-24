import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import { Movie, Category } from '../models';

/** Crear película */
export const createMovie: RequestHandler = async (req, res, next) => {
  try {
    const { title, synopsis, releaseYear, categoryIds } = req.body;
    const movie = await Movie.create({ title, synopsis, releaseYear });

    if (Array.isArray(categoryIds) && categoryIds.length) {
      const categories = await Category.findAll({ where: { id: categoryIds } });
      await movie.addCategories(categories);
    }

    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};

/** Actualizar película */
/** Actualizar película */
export const updateMovie: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, synopsis, releaseYear, categoryIds } = req.body;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      res.status(404).json({ error: 'No encontrada' });
      return;
    }

    await movie.update({ title, synopsis, releaseYear });

    if (Array.isArray(categoryIds)) {
      const categories = await Category.findAll({ where: { id: categoryIds } });
      await movie.setCategories(categories);
    }

    // Obtener el registro actualizado con las relaciones
    const updatedMovie = await Movie.findByPk(id, { include: Category });

    res.json(updatedMovie);
  } catch (err) {
    next(err);
  }
};

/** Obtener película por ID */
export const getMovieById: RequestHandler = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id, { include: Category });
    if (!movie) {
      res.status(404).json({ error: 'Película no encontrada' });
      return;
    }
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

/** Listar películas con paginación y filtro por título */
export const listMovies: RequestHandler = async (req, res, next) => {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (req.query.title) {
      where.title = { [Op.iLike]: `%${req.query.title}%` }; // usa Op.like en MySQL
    }

    const { rows, count } = await Movie.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,
      include: Category,
      order: [['title', 'ASC']],
    });

    res.json({
      data: rows,
      meta: { total: count, page, lastPage: Math.ceil(count / limit) },
    });
  } catch (err) {
    next(err);
  }
};

/** Eliminar película */
export const deleteMovie: RequestHandler = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      res.status(404).json({ error: 'Película no encontrada' });
      return;
    }

    await movie.destroy();
    res.json({ message: 'Película eliminada' });
  } catch (err) {
    next(err);
  }
};
