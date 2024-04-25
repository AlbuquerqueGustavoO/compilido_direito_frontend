import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PenalService {

  private urlCodigoPenal = environment.apiLink + 'penalCodigo';
  private urlCodigoPenalProcesso = environment.apiLink + 'penalCodigoProcesso';
  private urlCrimesHediondos = environment.apiLink + 'penalCrimesHediondos';
  private urlMariaPenha = environment.apiLink + 'penalMariaPenha';


  constructor(private http: HttpClient) { }

  getCodigoPenal(): Observable<any> {
    return this.http.get<any>(this.urlCodigoPenal);
  }

  getCodigoProcessoPenal(): Observable<any> {
    return this.http.get<any>(this.urlCodigoPenalProcesso);
  }

  getCrimesHediondosPenal(): Observable<any> {
    return this.http.get<any>(this.urlCrimesHediondos);
  }

  getMariaPenha(): Observable<any> {
    return this.http.get<any>(this.urlMariaPenha);
  }

}
