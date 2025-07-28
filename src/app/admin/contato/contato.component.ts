import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss'],
})
export class ContatoComponent implements OnInit {
  name!: string;
  email!: string;
  message!: string;

  ngOnInit(): void {}

  constructor(private adminService: AdminService) {}

  sendEmail() {
    const emailData = {
      name: this.name,
      email: this.email,
      message: this.message,
    };

    this.adminService.sendContact(emailData).subscribe({
      next: (response) => {
        console.log('Email enviado com sucesso!', response);
        this.reset();
        alert('Enviado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao enviar email:', error);
        alert('Erro, tente novamente!');
      },
    });
  }

  reset() {
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
