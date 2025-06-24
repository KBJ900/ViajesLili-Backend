import { Router } from 'express';
import {
  createMovie,
  updateMovie,
  getMovieById,
  listMovies,
  deleteMovie,
} from '../controllers/movieController';

const router = Router();

router.get('/', listMovies);
router.post('/', createMovie);
router.get('/:id', getMovieById);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

export default router;
