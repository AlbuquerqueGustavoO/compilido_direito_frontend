import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConstituicaoService {

  private urlConstitucional = environment.apiLink + 'constituicao'
  private urlConstitucionalEstadoSP = environment.apiLink + 'constituicaoEstadoSp'


  constructor(private http: HttpClient) { }

  getConstituicao(): Observable<any> {
    return this.http.get<any>(this.urlConstitucional);
  }

  getConstituicaoEstadoSP(): Observable<any> {
    return this.http.get<any>(this.urlConstitucionalEstadoSP);
  }

}
