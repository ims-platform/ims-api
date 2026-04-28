import { HttpException } from '@/modules/core/exceptions/http.exception';
import { RegisterInstituteDto } from '@/modules/institute/schemas/register.schema';
import { authService } from '@/modules/institute/services/auth.service';
import { instituteService } from '@/modules/institute/services/institute.service';

export const registerInstituteUseCase = async (dto: RegisterInstituteDto) => {
  const { institutionName, subdomain, firstName, lastName, email, password } = dto;

  const subdomainTaken = await instituteService.checkSubdomainExists(subdomain);
  if (subdomainTaken) {
    throw HttpException.conflict('El subdominio ya está en uso');
  }

  const authUser = await authService.createUser(email, password);

  try {
    //RPC ejecuta todo lo demas en una transaccion atomica
    const rpcResult = await instituteService.executeRegistrationRpc(
      authUser.id,
      institutionName,
      subdomain,
      firstName,
      lastName,
    );

    //Genera sesion automatica para el director
    const session = await authService.loginAndGetSession(email, password);

    return {
      institutionId: rpcResult.institution_id,
      subdomain: rpcResult.subdomain,
      session,
    };
  } catch (error) {
    await authService.deleteUser(authUser.id);
    throw error;
  }
};
