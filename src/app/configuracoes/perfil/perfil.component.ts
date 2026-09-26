import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  salvando = false;
  sucesso = false;
  erro = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      sobre: [''],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioAtual();
    if (usuario) {
      this.form.patchValue({ nome: usuario.nome, sobre: usuario.sobre ?? '', email: usuario.email });
    }
  }

  get nome() {
    return this.form.get('nome');
  }

  get email() {
    return this.form.get('email');
  }

  get senha() {
    return this.form.get('senha');
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const usuario = this.authService.getUsuarioAtual();
    if (!usuario) {
      return;
    }

    this.sucesso = false;
    this.erro = '';
    this.salvando = true;

    const { nome, sobre, email, senha } = this.form.value;
    const dados: { nome: string; sobre: string; email: string; senha?: string } = { nome, sobre, email };
    if (senha) {
      dados.senha = senha;
    }

    this.authService.atualizarPerfil(usuario.id, dados).subscribe({
      next: (resposta) => {
        this.salvando = false;
        if (resposta.error) {
          this.erro = resposta.mensagem;
          return;
        }
        this.sucesso = true;
        this.form.patchValue({ senha: '' });
      },
      error: () => {
        this.salvando = false;
        this.erro = 'Não foi possível salvar. Tente novamente mais tarde.';
      },
    });
  }
}
