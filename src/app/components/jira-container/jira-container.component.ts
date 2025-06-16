import { Component, computed, inject } from '@angular/core';
import { JiraService } from '../../services/jira.service';
import { httpResource } from '@angular/common/http';
import { SprintIssue, SprintIssueResponse } from '../../models/jira.model';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';
import { UserListComponent } from '../user-list/user-list.component';
import { workingHours } from '../../helpers';
import { MatDialog } from '@angular/material/dialog';
import { WorklogSummaryComponent } from '../worklog-summary/worklog-summary.component';

@Component({
  selector: 'app-jira-container',
  imports: [MatTableModule, MatIconModule, MatButtonModule, UserListComponent],
  templateUrl: './jira-container.component.html',
  styleUrl: './jira-container.component.scss',
})
export class JiraContainerComponent {
  workingHours = computed(() => workingHours(this.computedSprintStartDate(), 1));

  computedSprintStartDate = computed(() => {
    const startDate = new Date(environment.SPRINT_START_DATE);
    startDate.setFullYear(new Date().getFullYear());
    return startDate;
  });

  readonly jiraService = inject(JiraService);
  readonly dialog = inject(MatDialog);

  issueResource = httpResource<SprintIssueResponse>(() => ({
    url: 'data/sprint-issues.json',
    method: 'GET',
  }));

  issues = computed(() => this.issueResource.value()?.issues);
  workLogs = computed(
    () =>
      this.issues()
        ?.flatMap((issue) => issue.fields.worklog.worklogs)
        .filter(
          (workLog) =>
            new Date(workLog.started) >= this.computedSprintStartDate()
        ) || []
  );
  users = computed(() =>
    this.workLogs()
      ?.map((workLog) => workLog.author.displayName)
      .filter((value, index, self) => self.indexOf(value) === index)
  );

  onView(user: string) {
    this.dialog.open(WorklogSummaryComponent, {
      data: {
        user,
        issues: this.getIssuesByUser(user),
      },
    });
  }

  private getIssuesByUser(user: string): SprintIssue[] {
    const issueIds = this.workLogs()
      ?.filter((workLog) => workLog.author.displayName === user)
      .map((workLog) => workLog.issueId)
      .filter((value, index, self) => self.indexOf(value) === index);
    return this.issues()?.filter((issue) => issueIds?.includes(issue.id)) || [];
  }
}
