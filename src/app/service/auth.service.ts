import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export type Perfil = 'estudante' | 'advogado' | 'admin';

export interface Usuario {
  id: number;
  nome: string;
  sobre?: string;
  email: string;
  perfil: Perfil;
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

interface AtualizarPerfilResponse {
  error: boolean;
  mensagem: string;
  usuario?: Usuario;
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

  cadastrar(
    nome: string,
    sobre: string | null,
    email: string,
    senha: string,
    perfil: Exclude<Perfil, 'admin'>,
  ): Observable<CadastroResponse> {
    return this.http.post<CadastroResponse>(this.apiUrl + '/cadastrar', { nome, sobre, email, senha, perfil });
  }

  atualizarPerfil(
    id: number,
    dados: { nome: string; sobre: string; email: string; senha?: string },
  ): Observable<AtualizarPerfilResponse> {
    return this.http.put<AtualizarPerfilResponse>(`${this.apiUrl}/${id}`, dados).pipe(
      tap((resposta) => {
        if (resposta.error) {
          return;
        }
        const atual = this.usuarioAtualSubject.value;
        if (!atual) {
          return;
        }
        // O backend pode ou não devolver o usuário atualizado no corpo da
        // resposta — nos dois casos o cache local reflete o que acabou de
        // ser salvo, sem esperar um novo login pra refletir o nome novo etc.
        const atualizado: Usuario = {
          ...atual,
          nome: dados.nome,
          sobre: dados.sobre,
          email: dados.email,
          ...resposta.usuario,
        };
        sessionStorage.setItem(USUARIO_KEY, JSON.stringify(atualizado));
        this.usuarioAtualSubject.next(atualizado);
      }),
    );
  }

  getUsuarioAtual(): Usuario | null {
    return this.usuarioAtualSubject.value;
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
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

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
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
