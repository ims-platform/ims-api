import { Request, Response } from 'express';

import { HttpException } from '@/modules/core/exceptions/http.exception';
import { HttpResponse } from '@/modules/core/response/http.response';
import { checkSubdomainSchema } from '@/modules/institute/schemas/checkSubdomain.schema';
import { instituteService } from '@/modules/institute/services/institute.service';

export const checkSubdomainController = async (req: Request, res: Response): Promise<void> => {
  const validationResult = checkSubdomainSchema.safeParse({ subdomain: req.params.subdomain });

  if (!validationResult.success) {
    throw HttpException.badRequest('Subdominio inválido', validationResult.error.flatten().fieldErrors);
  }
  const { subdomain } = validationResult.data;
  const exists = await instituteService.checkSubdomainExists(subdomain);

  HttpResponse.success(res, { exists }, 'Verificación de subdominio completada');
};
