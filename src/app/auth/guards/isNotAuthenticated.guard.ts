import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/authService.service';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router      = inject( Router );

  if (authService.authStatus() === AuthStatus.athenticated) {
   router.navigateByUrl('/dashboard')
    return false;
  }

  return true;
};
