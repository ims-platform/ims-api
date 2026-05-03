import express from 'express';

import cors from 'cors';

import { errorHandler } from '@/modules/core/middlewares/error.middleware';
import router from '@/modules/routes/index';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Usa el dominio específico o permite todo si no está definido
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/v1', router);

app.use(errorHandler);

export default app;
