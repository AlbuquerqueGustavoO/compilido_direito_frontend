import { Component, EventEmitter, Output } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService, Usuario } from '../../service/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

  @Output() toggleSidebar = new EventEmitter<void>();

  menuAberto = false;
  usuarioAtual$: Observable<Usuario | null>;
  iniciais$: Observable<string>;

  constructor(private authService: AuthService) {
    this.usuarioAtual$ = this.authService.usuarioAtual$;
    this.iniciais$ = this.usuarioAtual$.pipe(map((usuario) => this.calcularIniciais(usuario)));
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  sair(): void {
    this.fecharMenu();
    this.authService.logout();
  }

  private calcularIniciais(usuario: Usuario | null): string {
    if (!usuario?.nome) {
      return '?';
    }
    const partes = usuario.nome.trim().split(/\s+/);
    const primeira = partes[0]?.[0] ?? '';
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
    return (primeira + ultima).toUpperCase();
  }
}
