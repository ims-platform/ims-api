import { z } from 'zod';

export const registerInstituteSchema = z.object({
  institutionName: z.string().min(3, 'El nombre de la institución debe tener al menos 3 caracteres'),
  subdomain: z
    .string()
    .min(3, 'El subdominio debe tener al menos 3 caracteres')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'El subdominio solo puede contener letras minúsculas, números y guiones'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});


export type RegisterInstituteDto = z.infer<typeof registerInstituteSchema>;
