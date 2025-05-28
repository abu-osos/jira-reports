import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JiraService {
  private proxyApiBaseUrl = '/api/jira';

  constructor(private http: HttpClient) { }

  getMyself(): Observable<any> {
    return this.http.get(`${this.proxyApiBaseUrl}/myself`);
  }
}
