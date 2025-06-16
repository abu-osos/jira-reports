import { Component, effect, input, output, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToHhMmPipe } from '../../pipes/to-hh-mm.pipe';
import { MatIconModule } from '@angular/material/icon';
import { WorklogItem } from '../../models/jira.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-list',
  imports: [MatTableModule, ToHhMmPipe, MatIconModule, MatButtonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  displayedColumns: string[] = ['name', 'hours', 'actions'];

  users = input.required<string[]>();
  workLogs = input.required<WorklogItem[]>();

  view = output<string>();

  dataSource = signal<MatTableDataSource<string>>(new MatTableDataSource());

  constructor() {
    effect(() => {
      this.dataSource.set(new MatTableDataSource(this.users()));
    });
  }

  loggedTime(user: string) {
    return (
      this.workLogs()
        ?.filter((workLog) => workLog.author.displayName === user)
        .reduce((acc, workLog) => acc + workLog.timeSpentSeconds, 0) || 0
    );
  }

  onView(user: string) {
    this.view.emit(user);
  }
}
