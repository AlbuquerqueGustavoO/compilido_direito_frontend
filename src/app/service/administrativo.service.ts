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
}