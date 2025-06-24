// src/server.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './models';

import movieRoutes from './routes/movieRoutes';
import categoryRoutes from './routes/categoryRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/movies', movieRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('DB sincronizada ✅');
    app.listen(PORT, () => console.log(`🚀  http://localhost:${PORT}`));
  } catch (err) {
    console.error('Error de conexión a la DB', err);
  }
})();
