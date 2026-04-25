import express from 'express';

import { errorHandler } from '@/modules/core/middlewares/error.middleware';
import router from '@/modules/routes/index';

const app = express();

app.use(express.json());
app.use('/api/v1', router);

app.use(errorHandler);

export default app;
