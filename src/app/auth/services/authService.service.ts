import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { LoginResponse } from '../interfaces/login-response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CheckTokenResponse } from '../interfaces/check-token.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private readonly baseUrl : string = environment.baseUrl;
  private httpClient:HttpClient = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  //! Al mundo exterior
  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );


  constructor() {
    //ejecuto esto en el constructor para que cuando se levante la app y se inicia el componente service chequear si el usuario ya se logueo
    //y las credenciales estan en el local storage
    this.checkAuthStatus().subscribe();
  }
  login( email: string, password: string ): Observable<boolean> {

    const url  = `${ this.baseUrl }/auth/login`;
    const body = { email, password };

    return this.httpClient.post<LoginResponse>( url, body )
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token )),
        catchError( err => throwError( () => err.error.message ))
      );
  }

  register(firstName:string,lastName:string,email:string,date:Date,role:string,password:string) {
    const url = `${this.baseUrl}/auth/register`;
    let newDate = new Date(date);
    console.log(newDate)
    const body = { firstName, lastName, email, newDate, role, password }
    return this.httpClient.post<LoginResponse>( url, body )
    .pipe(
      map( ({ user, token }) => this.setAuthentication( user, token )),
      catchError( err => throwError( () => err.error.message ))
    );
  }

  checkAuthStatus():Observable<boolean> {

    const url   = `${ this.baseUrl }/auth/check-token`;
    const token = localStorage.getItem('token');

    if ( !token ) {
      this.onLogOut();
      return of(false);
    }
    //Si o si debo establecer la palabra Authorization y Bearer junto con el token debido a la configracion de mi backend
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${ token }`);


    return this.httpClient.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token )),
        catchError(() => {
          this._authStatus.set( AuthStatus.nonAuthenticated );
          return of(false);
        })
      );


}

  private setAuthentication(user:User, token:string):boolean{
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.athenticated );
    localStorage.setItem('token', token);
    return true;
  }
  onLogOut() {
    localStorage.removeItem('token');
    this._currentUser.set(null)
    this._authStatus.set(AuthStatus.nonAuthenticated)

  }

}
