import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TributarioService {

  private urlTributarioCodigo = environment.apiLink + 'tributarioCodigo'



  constructor(private http: HttpClient) { }

  getCodigoTributario(): Observable<any> {
    return this.http.get<any>(this.urlTributarioCodigo);
  }

}
