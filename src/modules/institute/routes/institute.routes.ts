import { Router } from 'express';

import { asyncHandler } from '@/modules/core/middlewares/async.middleware';
import { validateSchema } from '@/modules/core/middlewares/validate.middleware';
import { registerController } from '@/modules/institute/controllers/register.controller';
import { registerInstituteSchema } from '@/modules/institute/schemas/register.schema';

const router = Router();

router.post('/register', validateSchema(registerInstituteSchema), asyncHandler(registerController));

export default router;
