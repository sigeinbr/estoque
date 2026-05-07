import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthGuard } from '../services/api/_auth/auth.guard';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
  constructor(private authGuard: AuthGuard) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next
      .handle(req)
      .pipe(catchError((err) => this.handleAuthError(err)));
  }

  private handleAuthError(
    err: HttpErrorResponse
  ): Observable<HttpEvent<unknown>> {
    if (err.status === 401) {
      this.authGuard.logout(false);
    }
    throw err;
  }
}
