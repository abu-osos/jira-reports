import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SprintIssueResponse } from '../models/jira.model';

@Injectable({
  providedIn: 'root',
})
export class JiraService {
  private readonly jiraUrl = 'https://gearsjira.atlassian.net/rest/agile/1.0/board/55/sprint/2109/issue?maxResults=1000';
  constructor(private http: HttpClient) {}

  getSprintIssues(): Observable<SprintIssueResponse> {
    return this.http.get<SprintIssueResponse>(this.jiraUrl);
  }
}
