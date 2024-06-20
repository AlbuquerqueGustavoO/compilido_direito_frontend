import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss']
})
export class ContatoComponent implements OnInit {

  name!: string;
  email!: string;
  message!: string;

  ngOnInit(): void {
  }

  constructor(private http: HttpClient) { }

  sendEmail() {
    const emailData = {
      name: this.name,
      email: this.email,
      message: this.message
    };

    this.http.post('http://localhost:3001/contato/send-email', emailData)
      .subscribe(
        response => {
          console.log('Email enviado com sucesso!', response);
          this.reset();
          alert("Enviado com sucesso!");
        },
        error => {
          console.error('Erro ao enviar email:', error);
          alert("Erro, tente novamente!");
        }
      );
  }
  reset(){
    this.name = "";
    this.email = "";
    this.message = "";
  }
}
