import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Usuario {
  id: number;
  nome: string;
  sobre?: string;
  email: string;
}

interface LoginResponse {
  error: boolean;
  mensagem: string;
  token?: string;
  usuario?: Usuario;
}

interface CadastroResponse {
  error: boolean;
  mensagem: string;
}

const TOKEN_KEY = 'cdl_token';
const USUARIO_KEY = 'cdl_usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiLink + 'user';

  private usuarioAtualSubject = new BehaviorSubject<Usuario | null>(this.lerUsuarioSalvo());
  usuarioAtual$ = this.usuarioAtualSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + '/login', { email, senha }).pipe(
      tap((resposta) => {
        if (!resposta.error && resposta.token && resposta.usuario) {
          // sessionStorage (não localStorage): o token não fica salvo entre
          // sessões do navegador, reduzindo a janela de exposição caso o
          // dispositivo seja comprometido — cada aba/sessão exige novo login.
          sessionStorage.setItem(TOKEN_KEY, resposta.token);
          sessionStorage.setItem(USUARIO_KEY, JSON.stringify(resposta.usuario));
          this.usuarioAtualSubject.next(resposta.usuario);
        }
      }),
    );
  }

  cadastrar(nome: string, sobre: string | null, email: string, senha: string): Observable<CadastroResponse> {
    return this.http.post<CadastroResponse>(this.apiUrl + '/cadastrar', { nome, sobre, email, senha });
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USUARIO_KEY);
    this.usuarioAtualSubject.next(null);
    this.router.navigateByUrl('/auth/login');
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(TOKEN_KEY);
  }

  private lerUsuarioSalvo(): Usuario | null {
    const bruto = sessionStorage.getItem(USUARIO_KEY);
    if (!bruto) {
      return null;
    }
    try {
      return JSON.parse(bruto) as Usuario;
    } catch {
      return null;
    }
  }
}
