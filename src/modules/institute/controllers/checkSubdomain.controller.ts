import { Request, Response } from 'express';
import { HttpResponse } from '@/modules/core/response/http.response';
import { HttpException } from '@/modules/core/exceptions/http.exception';
import { instituteService } from '@/modules/institute/services/institute.service';
import { checkSubdomainSchema } from '@/modules/institute/schemas/checkSubdomain.schema';


export const checkSubdomainController = async (req: Request, res: Response): Promise<void> => {
    const validationResult = checkSubdomainSchema.safeParse({ subdomain: req.params.subdomain });

    if (!validationResult.success) {
        throw HttpException.badRequest('Subdominio inválido', validationResult.error.flatten().fieldErrors);
    }
    const { subdomain } = validationResult.data;
    const exists = await instituteService.checkSubdomainExists(subdomain);

    HttpResponse.success(res, { exists }, 'Verificación de subdominio completada');
};