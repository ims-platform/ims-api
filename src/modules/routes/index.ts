import { Router } from 'express';

import instituteRoutes from '@/modules/institute/routes/institute.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Api is working!' });
});

router.use('/institutions', instituteRoutes);

export default router;
