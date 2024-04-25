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
  private urlDrogas = environment.apiLink + 'penalDrogas';
  private urlOrganizacaoCriminosa = environment.apiLink + 'penalOrganizacaoCriminosa';
  private urlOcultacaoBens = environment.apiLink + 'penalOcultacaoBens';


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

  getDrogas(): Observable<any> {
    return this.http.get<any>(this.urlDrogas);
  }

  getOrganizacaoCriminosa(): Observable<any> {
    return this.http.get<any>(this.urlOrganizacaoCriminosa);
  }

  getOcultacaoBens(): Observable<any> {
    return this.http.get<any>(this.urlOcultacaoBens);
  }

}
