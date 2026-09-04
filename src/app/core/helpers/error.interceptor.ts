import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError(err => {
    
        if (err.status === 401 || err.status === 403) {
          if (!this.router.url.includes('/auth/login')) {
            this.authService.logout();
          }
        }

        const error = err?.error?.message ||
                      err?.message ||
                      err?.statusText ||
                      'Ocurrió un error en la solicitud';

        return throwError(() => error);
      })
    );
  }
}