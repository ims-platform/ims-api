import { Router } from 'express';

import { asyncHandler } from '@/modules/core/middlewares/async.middleware';
import { validateSchema } from '@/modules/core/middlewares/validate.middleware';
import { checkSubdomainController } from '@/modules/institute/controllers/checkSubdomain.controller';
import { registerController } from '@/modules/institute/controllers/register.controller';
import { checkSubdomainSchema } from '@/modules/institute/schemas/checkSubdomain.schema';
import { registerInstituteSchema } from '@/modules/institute/schemas/register.schema';

const router = Router();

router.post('/register', validateSchema(registerInstituteSchema), asyncHandler(registerController));
router.get('/check-subdomain/:subdomain', validateSchema(checkSubdomainSchema), asyncHandler(checkSubdomainController));

export default router;
