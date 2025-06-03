import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JiraService } from '../../services/jira.service';
import { map } from 'rxjs/operators';
import { SprintIssue, WorklogItem } from '../../models/jira.model';

@Component({
  selector: 'app-jira-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jira-test.component.html',
  styleUrls: ['./jira-test.component.scss'],
})
export class JiraTestComponent implements OnInit {
  private jiraService = inject(JiraService);

  sprintStartDate = computed(() => new Date('2025-05-26T00:00:00.000+0400'));

  computedSprintStartDate = computed(() => {
    const originalSprintStartDate = this.sprintStartDate();
    // Clone the date to avoid mutating the original from the signal
    const dateToModify = new Date(originalSprintStartDate.getTime());
    const today = new Date();
    dateToModify.setFullYear(today.getFullYear());
    return dateToModify;
  });

  daysWithoutWeekends = computed(() => {
    const originalSprintStartDate = this.computedSprintStartDate();
    // Clone the date to avoid mutating the original from the signal
    const startDateForLoop = new Date(originalSprintStartDate.getTime());
    const today = new Date();
    let days = 0;
    for (
      let date = startDateForLoop; // Use the clone for the loop
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        days++;
      }
    }
    return days;
  });

  workingDaysHours = computed(() => {
    const leaveDays = 1;
    const daysWithoutWeekends = this.daysWithoutWeekends();
    return daysWithoutWeekends * 8 - leaveDays * 8;
  });

  issues = signal<SprintIssue[]>([]);

  workLogs = computed(() => {
    const workLogs = [];
    for (const issue of this.issues()) {
      for (const workLog of issue.fields.worklog.worklogs) {
        if (new Date(workLog.started) >= this.computedSprintStartDate()) {
          workLogs.push(workLog);
        }
      }
    }
    return workLogs;
  });

  distinctUsers = computed(() => {
    return this.workLogs()
      .map((workLog) => workLog.author.displayName)
      .filter((value, index, self) => self.indexOf(value) === index);
  });
  workLogsByUser = computed(() => {
    return this.workLogs().reduce(
      (acc: { [key: string]: WorklogItem[] }, workLog) => {
        acc[workLog.author.displayName] = [
          ...(acc[workLog.author.displayName] || []),
          workLog,
        ];
        return acc;
      },
      {}
    );
  });

  ngOnInit(): void {
    this.jiraService
      .getSprintIssues()
      .pipe(map((response) => response.issues))
      .subscribe((issues) => {
        this.issues.set(issues);
      });
  }

  getWorkLogsByUser(user: string) {
    const workLogs = this.workLogsByUser()[user];
    return this.secondsToHours(
      workLogs.reduce(
        (acc, workLog) => acc + workLog.timeSpentSeconds,
        0
      )
    );
  }

  getIssuesByUser(user: string) {
    const issueIds = this.workLogsByUser()
      [user].map((workLog) => workLog.issueId)
      .filter((value, index, self) => self.indexOf(value) === index);
    return issueIds;
  }

  getIssueNameById(issueId: string) {
    return this.issues().find((issue) => issue.id === issueId)?.fields.summary;
  }

  getIssueKeyById(issueId: string) {
    return this.issues().find((issue) => issue.id === issueId)?.key;
  }

  getIssueDateById(issueId: string) {
    return this.issues()
      .filter((issue) => issue.id === issueId)
      .map((issue) =>
        issue.fields.worklog.worklogs
          .filter(
            (workLog) =>
              new Date(workLog.started) >= this.computedSprintStartDate()
          )
          .map((workLog) => `${new Date(workLog.started).toLocaleDateString()}: ${this.secondsToHours(workLog.timeSpentSeconds)}`)
          .join(', ')
      )
      .join(', ');
  }

  getIssuesWorkLogsByUser(user: string, issueId: string) {
    const workLogs = this.workLogsByUser()[user].filter(
      (workLog) => workLog.issueId === issueId
    );
    return this.secondsToHours(
      workLogs.reduce(
        (acc, workLog) => acc + workLog.timeSpentSeconds,
        0
      )
    );
  }

  private secondsToHours(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}
