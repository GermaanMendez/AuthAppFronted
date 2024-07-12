import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/authService.service';
import { AuthStatus } from './auth/interfaces/auth-status.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private authService = inject(AuthService);
  private router      = inject(Router);

  public finishAuthCheck = computed<boolean>(()=>{
    if ( this.authService.authStatus() === AuthStatus.checking ) {
      return false;
    }
    return true;
  });

  //effect es como el useEffect en angular, se ejecuta cuando inicia el componente y cuando cambia la deoendncia
  public authStatusChangedEffect = effect(() => {

    switch( this.authService.authStatus() ) {

      case AuthStatus.checking:
        return;

      case AuthStatus.athenticated:
        this.router.navigateByUrl('/dashboard');
        return;

      case AuthStatus.nonAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;

    }
  })


}
