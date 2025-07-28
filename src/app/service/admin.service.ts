import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})


export class AdminService {
  private apiUrl = environment.apiLink + 'contato/send-email';

  constructor(private http: HttpClient) { }

  sendContact(emailData:any): Observable<any> {
    return this.http.post<any>(this.apiUrl, emailData);
  }

}