import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import actividadesRoutes from './routes/actividades.routes.js';
import inscripcionesRoutes from './routes/inscripciones.routes.js';
import { sendSuccess } from './utils/response.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/actividades', actividadesRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  sendSuccess(res, { status: 'ok' }, 'EcoHarmony Park API is running');
});

app.listen(PORT, () => {
  console.log(`🌳 EcoHarmony Park Server running on http://localhost:${PORT}`);
});
