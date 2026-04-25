import { registerInstituteService } from '@institute/services/institute.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { supabaseAdmin } from '@/modules/core/config/supabase.client';

// Mock del cliente de Supabase
vi.mock('@/modules/core/supabase.client', () => {
  return {
    supabaseAdmin: {
      from: vi.fn(),
      auth: {
        admin: {
          listUsers: vi.fn(),
          createUser: vi.fn(),
          deleteUser: vi.fn(),
        },
      },
    },
  };
});

const supabaseAdminMock = supabaseAdmin as unknown as {
  from: ReturnType<typeof vi.fn>;
  auth: {
    admin: {
      listUsers: ReturnType<typeof vi.fn>;
      createUser: ReturnType<typeof vi.fn>;
      deleteUser: ReturnType<typeof vi.fn>;
    };
  };
};

// Helper para construir el mock encadenado de supabase (.from().select().eq().maybeSingle())
type MockResponse = {
  data?: unknown;
  error?: { message: string } | null;
};

const mockChain = (finalValue: MockResponse) => ({
  select: vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      maybeSingle: vi.fn().mockResolvedValue(finalValue),
      single: vi.fn().mockResolvedValue(finalValue),
    }),
    single: vi.fn().mockResolvedValue(finalValue),
  }),

  insert: vi.fn().mockImplementation(() => {
    return {
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue(finalValue),
      }),

      then: (resolve: (value: MockResponse) => void) => resolve(finalValue),
    };
  }),

  delete: vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: null }),
  }),
});

const validDto = {
  institutionName: 'Instituto Test',
  subdomain: 'instituto-test',
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan@test.com',
  password: 'password123',
};

describe('registerInstituteService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // CAMINO FELIZ
  describe('Registro exitoso', () => {
    it('debe crear institución, usuario y director correctamente', async () => {
      // Subdominio no existe
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: null, error: null }));
      // listUsers sin el email
      supabaseAdminMock.auth.admin.listUsers.mockResolvedValueOnce({
        data: { users: [] },
        error: null,
      });
      // Crea institucion
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: { id: 'inst-123' }, error: null }));
      // Crea auth user
      supabaseAdminMock.auth.admin.createUser.mockResolvedValueOnce({
        data: { user: { id: 'user-123' } },
        error: null,
      });
      // Crea public.users
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: null, error: null }));
      // Crea directors
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: null, error: null }));

      const result = await registerInstituteService(validDto);

      expect(result.error).toBeUndefined();
      expect(result.data).toMatchObject({
        institutionId: 'inst-123',
        subdomain: validDto.subdomain,
        email: validDto.email,
      });
    });
  });

  // CAMINOS TRISTES
  describe('Validaciones de duplicados', () => {
    it('debe retornar error 409 si el subdominio ya está en uso', async () => {
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: { id: 'existing-inst' }, error: null }));

      const result = await registerInstituteService(validDto);

      expect(result.error?.code).toBe(409);
      expect(result.error?.message).toBe('El subdominio ya está en uso');
    });

    it('debe retornar error 409 si el correo ya está registrado', async () => {
      // Subdominio libre
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: null, error: null }));
      // Email ya existe
      supabaseAdminMock.auth.admin.listUsers.mockResolvedValueOnce({
        data: { users: [{ email: validDto.email }] },
        error: null,
      });

      const result = await registerInstituteService(validDto);

      expect(result.error?.code).toBe(409);
      expect(result.error?.message).toBe('El correo ya está registrado');
    });
  });

  describe('Errores de base de datos', () => {
    it('debe retornar error 500 si falla la creación de la institución', async () => {
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: null, error: null }));
      supabaseAdminMock.auth.admin.listUsers.mockResolvedValueOnce({
        data: { users: [] },
        error: null,
      });
      // Falla insert de institucion
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: null, error: { message: 'DB error' } }));

      const result = await registerInstituteService(validDto);
      console.log(supabaseAdminMock.from.mock.calls);
      expect(result.error?.code).toBe(500);
      expect(result.error?.message).toBe('Error al crear la institución');
    });

    it('debe retornar error 500 y hacer rollback si falla la creación del auth user', async () => {
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: null, error: null }));
      supabaseAdminMock.auth.admin.listUsers.mockResolvedValueOnce({
        data: { users: [] },
        error: null,
      });
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: { id: 'inst-123' }, error: null }));
      // Falla createUser
      supabaseAdminMock.auth.admin.createUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Auth error' },
      });
      // Rollback delete institucion
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: null, error: null }));

      const result = await registerInstituteService(validDto);
      console.log('RESULT:', result);
      console.log('FROM CALLS:', supabaseAdminMock.from.mock.calls);

      expect(result.error?.code).toBe(500);
      expect(result.error?.message).toBe('Error al crear el usuario');
      // Verificamos que se intento el rollback
      expect(supabaseAdminMock.from).toHaveBeenCalledTimes(3);
    });

    it('debe retornar error 500 y hacer rollback si falla la creación del perfil', async () => {
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: null, error: null }));
      supabaseAdminMock.auth.admin.listUsers.mockResolvedValueOnce({
        data: { users: [] },
        error: null,
      });
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: { id: 'inst-123' }, error: null }));
      supabaseAdminMock.auth.admin.createUser.mockResolvedValueOnce({
        data: { user: { id: 'user-123' } },
        error: null,
      });
      // Falla insert public.users
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: null, error: { message: 'Profile error' } }));
      // Rollbacks
      supabaseAdminMock.auth.admin.deleteUser.mockResolvedValueOnce({ error: null });
      supabaseAdminMock.from.mockReturnValueOnce(mockChain({ data: null, error: null }));

      const result = await registerInstituteService(validDto);

      expect(result.error?.code).toBe(500);
      expect(result.error?.message).toBe('Error al crear el perfil del director');
    });
  });
});
