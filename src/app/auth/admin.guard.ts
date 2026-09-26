import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

// Assume que authGuard já rodou antes (usuário logado) — só falta checar o
// perfil. Quem não é admin volta pra home, não pra tela de login.
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getUsuarioAtual()?.perfil === 'admin') {
    return true;
  }

  return router.createUrlTree(['/quemsomos/apresentacao']);
};
