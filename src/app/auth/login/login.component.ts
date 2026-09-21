import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  enviando = false;
  erro = '';
  mensagemCadastro = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.mensagemCadastro = this.route.snapshot.queryParamMap.get('cadastro') === 'ok';
  }

  get email() {
    return this.form.get('email');
  }

  get senha() {
    return this.form.get('senha');
  }

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.erro = '';
    this.enviando = true;

    const { email, senha } = this.form.value;
    this.authService.login(email, senha).subscribe({
      next: (resposta) => {
        this.enviando = false;
        if (resposta.error) {
          this.erro = resposta.mensagem;
          return;
        }
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.enviando = false;
        // Só 401 (credenciais inválidas) é uma mensagem pensada para o
        // usuário; qualquer outro status é falha inesperada do servidor —
        // não faz sentido mostrar a exceção crua (ex.: erro de configuração
        // do backend) na tela de login.
        this.erro = err?.status === 401 && err?.error?.mensagem
          ? err.error.mensagem
          : 'Não foi possível entrar. Tente novamente mais tarde.';
      },
    });
  }
}
