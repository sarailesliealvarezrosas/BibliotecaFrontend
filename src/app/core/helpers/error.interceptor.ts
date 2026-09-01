import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    ) {}

intercept(
  request: HttpRequest<any>,
  next: HttpHandler
): Observable<HttpEvent<any>> {

  return next.handle(request).pipe(
    catchError(err => {

      const error =
        err?.error?.message ||
        err?.statusText ||
        'Ocurrió un error en la solicitud';

      return throwError(() => error);
    })
  );
}  
}

