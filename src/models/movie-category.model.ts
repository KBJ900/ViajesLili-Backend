// src/models/movie-category.model.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class MovieCategory extends Model {}

MovieCategory.init(
  {
    movieId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'MovieCategory',
    tableName: 'movie_categories',
    timestamps: false,
  }
);
