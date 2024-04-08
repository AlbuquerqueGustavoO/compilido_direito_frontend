import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CivilService {
  private apiUrl = environment.apiLink + 'civil';
  private urlCodigoCivil = environment.apiLink + 'civil-codigo-processo';
  private urlNormasCivil = environment.apiLink + 'civil-direito-brasileiro';

  constructor(private http: HttpClient) { }

  getTexto(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCodigoCivil(): Observable<any> {
    return this.http.get<any>(this.urlCodigoCivil);
  }
  getNormasCivil(): Observable<any> {
    return this.http.get<any>(this.urlNormasCivil);
  }
}