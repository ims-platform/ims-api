import { Router } from 'express';

import { registerController } from '@/modules/institute/controllers/register.controller';

const router = Router();

router.post('/register', registerController);

export default router;
