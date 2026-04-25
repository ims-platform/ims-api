import { describe, expect, it } from 'vitest';

import { registerInstituteSchema } from '@/modules/institute/schemas/register.schema';

describe('registerInstituteSchema', () => {
  it('debe validar correctamente un dto válido', () => {
    const result = registerInstituteSchema.safeParse({
      institutionName: 'Instituto Test',
      subdomain: 'instituto-test',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@test.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
  });

  it('debe fallar si el subdominio tiene caracteres inválidos', () => {
    const result = registerInstituteSchema.safeParse({
      institutionName: 'Instituto Test',
      subdomain: 'Mi Subdominio!!',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@test.com',
      password: 'password123',
    });

    expect(result.success).toBe(false);
  });

  it('debe fallar si el email es inválido', () => {
    const result = registerInstituteSchema.safeParse({
      institutionName: 'Instituto Test',
      subdomain: 'instituto-test',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'no-es-email',
      password: 'password123',
    });

    expect(result.success).toBe(false);
  });
});
