import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})


export class AdministrativoService {
  private apiUrl = environment.apiLink + 'administrativoContratos';
  private apiUrlImprobidade = environment.apiLink + 'administrativoImprobidade';
  private apiUrlServPublic = environment.apiLink + 'administrativoServicosPublicos';
  private apiUrlAdmProcesso = environment.apiLink + 'administrativoProcesso';
  private apiUrlAdmServidorePublico = environment.apiLink + 'administrativoServidoresPublico';
  private apiUrlAdmParceriaPublica = environment.apiLink + 'administrativoParceriaPublico';

  constructor(private http: HttpClient) { }

  getAdminContratos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getAdminImprobidade(): Observable<any> {
    return this.http.get<any>(this.apiUrlImprobidade);
  }

  getAdminServicosPublico(): Observable<any> {
    return this.http.get<any>(this.apiUrlServPublic);
  }

  getAdminProcesso(): Observable<any> {
    return this.http.get<any>(this.apiUrlAdmProcesso);
  }

  getAdminServidoresPublico(): Observable<any> {
    return this.http.get<any>(this.apiUrlAdmServidorePublico);
  }

  getAdminParceriaPublica(): Observable<any> {
    return this.http.get<any>(this.apiUrlAdmParceriaPublica);
  }

}