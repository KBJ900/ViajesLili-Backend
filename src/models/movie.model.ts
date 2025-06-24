// src/models/movie.model.ts
import {
  DataTypes,
  Model,
  Optional,
  BelongsToManyAddAssociationsMixin,
  BelongsToManySetAssociationsMixin,
} from 'sequelize';
import { sequelize } from '../config/database';
import type { Category } from './category.model';

interface MovieAttrs {
  id: number;
  title: string;
  synopsis?: string;
  releaseYear?: number;
  createdAt?: Date; 
  updatedAt?: Date; 
}

interface MovieCreationAttrs extends Optional<MovieAttrs, 'id' | 'createdAt' | 'updatedAt'> {}

export class Movie extends Model<MovieAttrs, MovieCreationAttrs> implements MovieAttrs {
  public id!: number;
  public title!: string;
  public synopsis?: string;
  public releaseYear?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addCategories!: BelongsToManyAddAssociationsMixin<Category, number>;
  public setCategories!: BelongsToManySetAssociationsMixin<Category, number>;
}

Movie.init(
  {
    id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title:       { type: DataTypes.STRING, allowNull: false },
    synopsis:    { type: DataTypes.TEXT },
    releaseYear: { type: DataTypes.INTEGER },
  },
  {
    sequelize,
    tableName: 'movies',
    timestamps: true,
  }
);
