import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';

const TOKEN_HEADER_KEY = 'Authorization';       

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = window.sessionStorage.getItem(GlobalComponent.TOKEN_KEY);

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`)
      });

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
