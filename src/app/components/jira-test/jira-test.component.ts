import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JiraService } from '../../services/jira.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-jira-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jira-test.component.html',
  styleUrls: ['./jira-test.component.scss']
})
export class JiraTestComponent implements OnInit {
  private jiraService = inject(JiraService);
  jiraResponse$!: Observable<any>;

  ngOnInit(): void {
    this.jiraResponse$ = this.jiraService.getMyself().pipe(
      catchError(error => {
        console.error('Error fetching Jira data:', error);
        return of({ error: true, message: error.message, status: error.status, errorResponse: error.error });
      })
    );
  }
}
