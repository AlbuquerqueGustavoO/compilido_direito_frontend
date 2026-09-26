import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

function senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
  const senha = control.get('senha')?.value;
  const confirmarSenha = control.get('confirmarSenha')?.value;
  return senha && confirmarSenha && senha !== confirmarSenha ? { senhasDiferentes: true } : null;
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent {
  form: FormGroup;
  enviando = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3)]],
        sobre: [''],
        email: ['', [Validators.required, Validators.email]],
        perfil: ['', [Validators.required]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', [Validators.required]],
      },
      { validators: senhasIguaisValidator },
    );
  }

  get nome() {
    return this.form.get('nome');
  }

  get email() {
    return this.form.get('email');
  }

  get perfil() {
    return this.form.get('perfil');
  }

  get senha() {
    return this.form.get('senha');
  }

  get confirmarSenha() {
    return this.form.get('confirmarSenha');
  }

  cadastrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.erro = '';
    this.enviando = true;

    const { nome, sobre, email, senha, perfil } = this.form.value;
    this.authService.cadastrar(nome, sobre || null, email, senha, perfil).subscribe({
      next: (resposta) => {
        this.enviando = false;
        if (resposta.error) {
          this.erro = resposta.mensagem;
          return;
        }
        this.router.navigate(['/auth/login'], { queryParams: { cadastro: 'ok' } });
      },
      error: (err) => {
        this.enviando = false;
        // 400 aqui normalmente é uma mensagem pensada pro usuário (e-mail já
        // cadastrado); qualquer outro status é falha inesperada do servidor.
        this.erro = err?.status === 400 && err?.error?.mensagem
          ? err.error.mensagem
          : 'Não foi possível concluir o cadastro. Tente novamente mais tarde.';
      },
    });
  }
}
