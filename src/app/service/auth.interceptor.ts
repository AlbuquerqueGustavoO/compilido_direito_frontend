import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // Só anexa o token nas chamadas pra nossa própria API, nunca em serviços de terceiros.
    if (!token || !req.url.startsWith(environment.apiLink)) {
      return next.handle(req);
    }

    const reqComToken = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next.handle(reqComToken);
  }
}
