import { supabaseAdmin } from '@/modules/core/config/supabase.client';
import { HttpException } from '@/modules/core/exceptions/http.exception';

export const instituteService = {
  async checkSubdomainExists(subdomain: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('institutions')
      .select('id')
      .eq('subdomain', subdomain)
      .maybeSingle();

    if (error) {
      throw HttpException.internalServer('Error al verificar el subdominio');
    }
    return !!data;
  },

  async executeRegistrationRpc(
    authUserId: string,
    institutionName: string,
    subdomain: string,
    firstName: string,
    lastName: string,
  ) {
    const { data, error } = await supabaseAdmin.rpc('register_tenant_complete', {
      p_auth_user_id: authUserId,
      p_institution_name: institutionName,
      p_subdomain: subdomain,
      p_first_name: firstName,
      p_last_name: lastName,
      p_plan_code: 'FREE',
    });
    if (error) {
      console.error('[RPC Error]:', error);
      throw HttpException.internalServer('Error interno al configurar la institución');
    }
    return data as { institution_id: string; subdomain: string };
  },
};
