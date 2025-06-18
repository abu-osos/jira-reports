import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SprintIssue, WorklogItem } from '../../models/jira.model';
import { DatePipe } from '@angular/common';
import { ToHhMmPipe } from '../../pipes/to-hh-mm.pipe';
import { FormatCommentPipe } from '../../pipes/format-comment.pipe';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

interface DialogData {
  user: string;
  issues: SprintIssue[];
  sprintStartDate: Date;
}

interface DateViewWorklog {
  issueKey: string;
  issueSummary: string;
  started: Date;
  timeSpentSeconds: number;
  comment?: string;
}

@Component({
  selector: 'app-worklog-summary',
  standalone: true,
  imports: [
    MatDialogModule,
    DatePipe,
    ToHhMmPipe,
    FormatCommentPipe,
    MatButtonToggleModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './worklog-summary.component.html',
  styleUrl: './worklog-summary.component.scss',
})
export class WorklogSummaryComponent implements OnInit {
  data = inject<DialogData>(MAT_DIALOG_DATA);
  viewMode: 'issue' | 'date' = 'issue';
  worklogsByDate = new Map<string, DateViewWorklog[]>();

  ngOnInit(): void {
    this.groupWorklogsByDate();
  }

  worklogByUser(issueId: string): WorklogItem[] {
    const worklogs = this.data.issues.find((issue) => issue.id === issueId)
      ?.fields.worklog.worklogs;
    return (
      worklogs?.filter(
        (worklog) =>
          worklog.author.displayName === this.data.user &&
          new Date(worklog.started) >= this.data.sprintStartDate
      ) || []
    );
  }

  private groupWorklogsByDate(): void {
    const allWorklogs: DateViewWorklog[] = [];
    this.data.issues.forEach((issue) => {
      const userWorklogs =
        issue.fields.worklog.worklogs?.filter(
          (worklog) =>
            worklog.author.displayName === this.data.user &&
            new Date(worklog.started) >= this.data.sprintStartDate
        ) || [];

      userWorklogs.forEach((worklog) => {
        allWorklogs.push({
          issueKey: issue.key,
          issueSummary: issue.fields.summary,
          started: new Date(worklog.started),
          timeSpentSeconds: worklog.timeSpentSeconds,
          comment: worklog.comment,
        });
      });
    });

    const grouped = allWorklogs.reduce((acc, worklog) => {
      const date = worklog.started.toDateString();
      if (!acc.has(date)) {
        acc.set(date, []);
      }
      acc.get(date)?.push(worklog);
      return acc;
    }, new Map<string, DateViewWorklog[]>());

    this.worklogsByDate = new Map(
      [...grouped.entries()].sort(
        (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
      )
    );
  }
}
