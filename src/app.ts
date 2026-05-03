import express from 'express';

import cors from 'cors';

import { errorHandler } from '@/modules/core/middlewares/error.middleware';
import router from '@/modules/routes/index';

const app = express();

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    /^http:\/\/localhost:\d+$/, // Permite cualquier puerto local (ej. 3000, 5000, 8080). Se deja asi hasta que exista un dominio fijo.
  ],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/v1', router);

app.use(errorHandler);

export default app;
