import { describe, expect, it } from 'vitest';

import { checkSubdomainSchema } from '@/modules/institute/schemas/checkSubdomain.schema';

describe('checkSubdomainSchema', () => {
  it('should validate a valid subdomain (happy path)', () => {
    const validData = { subdomain: 'instituto-test-123' };
    const result = checkSubdomainSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should invalidate a subdomain with less than 3 characters', () => {
    const invalidData = { subdomain: 'ab' };
    const result = checkSubdomainSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El subdominio debe tener al menos 3 caracteres');
    }
  });

  it('should invalidate a subdomain with more than 50 characters', () => {
    const invalidData = { subdomain: 'a'.repeat(51) };
    const result = checkSubdomainSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El subdominio no puede tener más de 50 caracteres');
    }
  });

  it('should invalidate a subdomain with uppercase letters', () => {
    const invalidData = { subdomain: 'Instituto-test' };
    const result = checkSubdomainSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'El subdominio solo puede contener letras minúsculas, números y guiones',
      );
    }
  });

  it('should invalidate a subdomain with spaces', () => {
    const invalidData = { subdomain: 'instituto test' };
    const result = checkSubdomainSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'El subdominio solo puede contener letras minúsculas, números y guiones',
      );
    }
  });

  it('should invalidate a subdomain with symbols other than hyphen', () => {
    const invalidData = { subdomain: 'instituto@test' };
    const result = checkSubdomainSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'El subdominio solo puede contener letras minúsculas, números y guiones',
      );
    }
  });
});
