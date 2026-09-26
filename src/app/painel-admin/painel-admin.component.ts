import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../service/auth.service';

@Component({
  selector: 'app-painel-admin',
  templateUrl: './painel-admin.component.html',
  styleUrls: ['./painel-admin.component.scss'],
})
export class PainelAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  carregando = true;
  erro = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    this.authService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os usuários.';
        this.carregando = false;
      },
    });
  }

  trackById(_index: number, usuario: Usuario): number {
    return usuario.id;
  }
}
