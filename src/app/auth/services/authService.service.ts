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
  private _authStatus  = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus  = computed(() => this._authStatus());

  constructor() {
    //ejecuto esto en el constructor para que cuando se levante la app y se inicia el componente service chequear si el usuario ya se logueo
    //y las credenciales estan en el local storage
    this.checkAuthStatus().subscribe();
  }

  login(email:string, password:string):Observable<boolean>{
    
    const url = `${this.baseUrl}/auth/login`;
    const body = {email:email,password:password};
    // console.log(body)
    return this.httpClient.post<LoginResponse>(url,body)
           .pipe(
            tap(response => {
              this.updateAuthStatus(response.user,response.token)
            }),
            map(() => true),
            catchError(err =>{
              return throwError(() => err.error);
            })
          );
  }

  checkAuthStatus():Observable<boolean>{
    const url = `${this.baseUrl}/auth/check-token`
    const token = localStorage.getItem('token');
    console.log("TOKEN: " +  token)
    if(!token) return of(false);
    
    //Si o si debo establecer la palabra Authorization y Bearer junto con el token debido a la configracion de mi backend
    const headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)
    console.log("headers: " + JSON.stringify(headers))

    return this.httpClient.get<CheckTokenResponse>(url,{headers:headers})
            .pipe(
              map( (response) =>{
                this.updateAuthStatus(response.user,response.token)
                return true;
              }),
             
              catchError(() => {
                // this._authStatus.set(AuthStatus.nonAuthenticated);
                return of(false);
              })
            )
  }

  private updateAuthStatus(user:User, token:string){
    if(!user || !token)return;
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.athenticated);
    localStorage.setItem('token',token);
    return true;
  }

}
