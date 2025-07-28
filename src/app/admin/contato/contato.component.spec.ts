import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContatoComponent } from './contato.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('ContatoComponent', () => {
  let component: ContatoComponent;
  let fixture: ComponentFixture<ContatoComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContatoComponent],
      imports: [FormsModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ContatoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com os campos vazios', () => {
    expect(component.name).toBeUndefined();
    expect(component.email).toBeUndefined();
    expect(component.message).toBeUndefined();
  });

  it('deve atualizar os valores no componente ao preencher o formulário', async () => {
    const nomeInput = fixture.debugElement.query(By.css('#nome')).nativeElement;
    const emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
    const mensagemInput = fixture.debugElement.query(By.css('#mensagem')).nativeElement;

    nomeInput.value = 'Gustavo';
    nomeInput.dispatchEvent(new Event('input'));

    emailInput.value = 'gustavo@email.com';
    emailInput.dispatchEvent(new Event('input'));

    mensagemInput.value = 'Olá, isso é um teste.';
    mensagemInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.name).toBe('Gustavo');
    expect(component.email).toBe('gustavo@email.com');
    expect(component.message).toBe('Olá, isso é um teste.');
  });

  it('deve chamar o endpoint ao enviar o formulário', () => {
    component.name = 'Gustavo';
    component.email = 'gustavo@email.com';
    component.message = 'Olá!';
    
    component.sendEmail();

    const req = httpMock.expectOne('https://compiladodeleis.com.br:3001/contato/send-email');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Gustavo',
      email: 'gustavo@email.com',
      message: 'Olá!'
    });

    req.flush({ status: 'ok' });

    httpMock.verify();
  });

  it('deve limpar os campos com reset()', () => {
    component.name = 'aaa';
    component.email = 'aaa@email.com';
    component.message = 'mensagem';
    component.reset();
    expect(component.name).toBe('');
    expect(component.email).toBe('');
    expect(component.message).toBe('');
  });
});
