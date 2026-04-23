import { Request, Response } from 'express';

import { registerInstituteSchema } from '@/modules/institute/schemas/register.schema';
import { registerInstituteService } from '@/modules/institute/services/institute.service';

export const registerController = async (req: Request, res: Response): Promise<void> => {
  const validation = registerInstituteSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: 'Datos inválidos',
      errors: validation.error.flatten().fieldErrors,
    });
    return;
  }

  const result = await registerInstituteService(validation.data);

  if (result.error) {
    res.status(result.error.code).json({ message: result.error.message });
    return;
  }

  res.status(201).json({
    message: 'Institución registrada exitosamente',
    data: result.data,
  });
};
