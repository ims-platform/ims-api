import { Router } from 'express';

import instituteRoutes from '@/modules/institute/routes/institute.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/institutions', instituteRoutes);

export default router;
