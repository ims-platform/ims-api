import { Request, Response } from 'express';

import { HttpResponse } from '@/modules/core/response/http.response';
import { RegisterInstituteDto } from '@/modules/institute/schemas/register.schema';
import { registerInstituteUseCase } from '@/modules/institute/use-cases/register-institute.usecase';

export const registerController = async (req: Request, res: Response): Promise<void> => {
  const dto = req.body as RegisterInstituteDto;
  const result = await registerInstituteUseCase(dto);
  HttpResponse.created(res, result, 'Institución registrada exitosamente');
};
