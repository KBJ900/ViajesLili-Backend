// src/models/index.ts
import { sequelize } from '../config/database';
import { Movie } from './movie.model';
import { Category } from './category.model';
import { MovieCategory } from './movie-category.model';

// 👉 many-to-many
Movie.belongsToMany(Category, {
  through: MovieCategory,
  foreignKey: 'movieId',
  otherKey: 'categoryId',
});
Category.belongsToMany(Movie, {
  through: MovieCategory,
  foreignKey: 'categoryId',
  otherKey: 'movieId',
});

export { sequelize, Movie, Category, MovieCategory };
