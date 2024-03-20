import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CivilService {
  //private apiUrl = 'http://localhost:8080/civilScraping';
  private apiUrl = 'http://54.94.127.45:8080/civilScraping';
  ;
  constructor(private http: HttpClient) { }

  getTexto(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}