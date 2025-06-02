import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SprintIssueResponse } from '../models/jira.model';

@Injectable({
  providedIn: 'root',
})
export class JiraService {
  constructor(private http: HttpClient) {}

  getSprintIssues(): Observable<SprintIssueResponse> {
    return this.http.get<SprintIssueResponse>('data/sprint-issues.json');
  }
}
