import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SprintIssue, WorklogItem } from '../../models/jira.model';
import { DatePipe } from '@angular/common';
import { ToHhMmPipe } from '../../pipes/to-hh-mm.pipe';
import { FormatCommentPipe } from '../../pipes/format-comment.pipe';

interface DialogData {
  user: string;
  issues: SprintIssue[];
  sprintStartDate: Date;
}

@Component({
  selector: 'app-worklog-summary',
  standalone: true,
  imports: [MatDialogModule, DatePipe, ToHhMmPipe, FormatCommentPipe],
  templateUrl: './worklog-summary.component.html',
  styleUrl: './worklog-summary.component.scss',
})
export class WorklogSummaryComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);

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
}
