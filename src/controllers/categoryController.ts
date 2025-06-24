import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import { Category, Movie } from '../models';

/** Listar categorías con paginación y filtro */
export const listCategories: RequestHandler = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (req.query.name) {
      where.name = { [Op.iLike]: `%${req.query.name}%` };
    }

    const { rows, count } = await Category.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,
      include: Movie,
      order: [['name', 'ASC']],
    });

    res.json({
      data: rows,
      meta: { total: count, page, lastPage: Math.ceil(count / limit) },
    });
  } catch (err) {
    next(err);
  }
};

/** Obtener categoría por ID */
export const getCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, { include: Movie });
    if (!category) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
};


/** Crear nueva categoría */
export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const { name, description, movieIds = [] } = req.body;

    const category = await Category.create({ name, description });
    if (movieIds.length > 0) {
      await category.setMovies(movieIds);
    }

    const result = await Category.findByPk(category.id, { include: Movie });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

/** Actualizar una categoría existente */
export const updateCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, movieIds = [] } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }

    await category.update({ name, description });

    if (movieIds) {
      await category.setMovies(movieIds);
    }

    const result = await Category.findByPk(category.id, { include: Movie });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/** Eliminar categoría */
export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }

    await category.setMovies([]); // Limpia relaciones
    await category.destroy();

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    next(err);
  }
};

