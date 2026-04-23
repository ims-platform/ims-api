import { supabaseAdmin } from '@/modules/core/supabase.client';
import { RegisterInstituteDto } from '@/modules/institute/schemas/register.schema';

const TRIAL_DAYS = 15;

export const registerInstituteService = async (dto: RegisterInstituteDto) => {
  const { institutionName, subdomain, firstName, lastName, email, password } = dto;

  //Verifica subdominio
  const { data: existingInstitution } = await supabaseAdmin
    .from('institutions')
    .select('id')
    .eq('subdomain', subdomain)
    .maybeSingle();

  if (existingInstitution) {
    return { error: { message: 'El subdominio ya está en uso', code: 409 } };
  }

  // TECH DEBT:
  // Esta validacion usa listUsers(), lo cual no escala.
  // Refactorizar cuando exista integracion mas directa con auth.users.
  const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
  const emailTaken = existingUser?.users.some((u) => u.email === email);

  if (emailTaken) {
    return { error: { message: 'El correo ya está registrado', code: 409 } };
  }

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);

  const { data: institution, error: institutionError } = await supabaseAdmin
    .from('institutions')
    .insert({
      name: institutionName,
      subdomain,
      status: 'TRIAL',
    })
    .select('id')
    .single();

  if (institutionError || !institution) {
    return { error: { message: 'Error al crear la institución', code: 500 } };
  }

  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    // Rollback manual de la institucion
    await supabaseAdmin.from('institutions').delete().eq('id', institution.id);
    return { error: { message: 'Error al crear el usuario', code: 500 } };
  }

  //Crea perfil en public.users
  const { error: userError } = await supabaseAdmin.from('users').insert({
    id: authUser.user.id,
    institution_id: institution.id,
    role: 'DIRECTOR',
    first_name: firstName,
    last_name: lastName,
  });

  if (userError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    await supabaseAdmin.from('institutions').delete().eq('id', institution.id);
    return { error: { message: 'Error al crear el perfil del director', code: 500 } };
  }

  const { error: directorError } = await supabaseAdmin.from('directors').insert({ id: authUser.user.id });

  if (directorError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    await supabaseAdmin.from('institutions').delete().eq('id', institution.id);
    return { error: { message: 'Error al registrar el director', code: 500 } };
  }

  return {
    data: {
      institutionId: institution.id,
      subdomain,
      email,
    },
  };
};
