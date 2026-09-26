import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
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

    return next.handle(reqComToken).pipe(
      catchError((erro: HttpErrorResponse) => {
        // Login/cadastro nunca chegam aqui (não têm token pra anexar), então
        // um 401 numa chamada que já mandou token só pode ser sessão
        // expirada ou inválida — não é erro de credencial pro componente
        // tratar, é hora de deslogar e voltar pro login.
        if (erro.status === 401) {
          this.authService.logout();
        }
        return throwError(() => erro);
      }),
    );
  }
}
