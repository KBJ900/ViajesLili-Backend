// src/models/category.model.ts
import {
  DataTypes,
  Model,
  Optional,
  Association,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
} from 'sequelize';
import { sequelize } from '../config/database';
import type { Movie } from './movie.model';

interface CategoryAttrs {
  id: number;
  name: string;
  description?: string; // NUEVO: opcional
  createdAt?: Date;     // NUEVO: timestamps
  updatedAt?: Date;
}

interface CategoryCreationAttrs extends Optional<CategoryAttrs, 'id' | 'description'> {}

export class Category extends Model<CategoryAttrs, CategoryCreationAttrs> implements CategoryAttrs {
  public id!: number;
  public name!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public setMovies!: HasManySetAssociationsMixin<Movie, number>;
  public addMovies!: HasManyAddAssociationsMixin<Movie, number>;

  public static associations: {
    movies: Association<Category, Movie>;
  };
}

Category.init(
  {
    id:   { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true }, // NUEVO CAMPO
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true, // ACTIVAR TIMESTAMPS
  }
);
