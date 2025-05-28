import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JiraService {
  private jiraUrl = environment.jiraUrl;
  private apiToken = environment.jiraApiToken;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    // For Jira Cloud API token, you typically use Basic authentication
    // The token is your email address and the API token, base64 encoded
    // Example: 'Basic ' + btoa('your-email@example.com:' + this.apiToken)
    // However, the token you provided looks like a personal access token
    // which might be used directly as a Bearer token.
    // Let's try with Bearer token first, as it's simpler.
    // If this doesn't work, we'll switch to Basic Auth.

    // IMPORTANT: For Basic Auth, you would need your Jira email address.
    // If Bearer doesn't work, I will ask you for it.
    return new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken}`,
      'Accept': 'application/json'
    });
  }

  getMyself(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.jiraUrl}/rest/api/3/myself`, { headers });
  }
}
