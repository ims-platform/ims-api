import express from 'express';

import cors from 'cors';

import { errorHandler } from '@/modules/core/middlewares/error.middleware';
import router from '@/modules/routes/index';

const app = express();

// TODO: Configurar CORS para permitir acceso solo al dominio del Frontend en producción.
// Actualmente está configurado por defecto permitiendo acceso a cualquier origen '*'.
app.use(cors());

app.use(express.json());
app.use('/api/v1', router);

app.use(errorHandler);

export default app;
