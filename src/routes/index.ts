import { Router } from 'express';

import { sum } from '@/helpers/sum';

const router = Router();

router.get('/', (_req, res) => {
  const suma = sum(1, 2);
  res.json({ message: 'Api is working!', suma });
});

export default router;
