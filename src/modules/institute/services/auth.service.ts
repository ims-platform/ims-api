import { supabaseAdmin, supabaseClient } from '@/modules/core/config/supabase.client';
import { HttpException } from '@/modules/core/exceptions/http.exception';

export const authService = {
  async createUser(email: string, password: string) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error || !data.user) {
      if (error?.message.includes('already registered')) {
        throw HttpException.conflict('El correo ya está registrado');
      }
      throw HttpException.internalServer('Error al crear credenciales');
    }
    return data.user;
  },

  async deleteUser(userId: string) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
  },

  async loginAndGetSession(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw HttpException.internalServer('Error al generar sesión automática');
    }
    return data.session;
  },
};
