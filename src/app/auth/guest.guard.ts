import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

// Landing pública: quem já está logado não deve ver a página de marketing,
// e sim cair direto no sistema.
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/quemsomos/apresentacao']);
  }

  return true;
};
