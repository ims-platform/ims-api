import { z } from 'zod';

export const checkSubdomainSchema = z.object({
  subdomain: z
    .string()
    .min(3, 'El subdominio debe tener al menos 3 caracteres')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'El subdominio solo puede contener letras minúsculas, números y guiones'),
});

export type CheckSubdomainDto = z.infer<typeof checkSubdomainSchema>;
