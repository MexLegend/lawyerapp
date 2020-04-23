import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(
    public injector: Injector
  ) { }
  

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const _usersS = this.injector.get(UsersService);

    if (_usersS) {
      req = req.clone({
        setHeaders: {
          token: `${ _usersS.getToken() }`
        }
      });
    }

    return next
      .handle( req )
      .pipe(
        catchError( error => {
          if (error instanceof HttpErrorResponse && error.status === 0) {
            console.log('Check Your Internet Connection And Try again Later');
          } else if (error instanceof HttpErrorResponse && error.status === 401) {
            _usersS.logout();

            location.reload(true);
          }
          return throwError(error)
        })
      )
  }

  // handleError( error: HttpErrorResponse ) {
  //   if (error instanceof HttpErrorResponse && error.status === 0) {
  //     console.log('Check Your Internet Connection And Try again Later');
  //   } else if (error instanceof HttpErrorResponse && error.status === 401) {
  //     console.log(error);

  //     this._usersS.logout();

  //     location.reload(true);
  //   }
  //   return throwError(error)
  // }
}
