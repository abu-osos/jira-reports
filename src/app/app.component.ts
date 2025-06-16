import { Component } from '@angular/core';
import { JiraContainerComponent } from './components/jira-container/jira-container.component';

@Component({
  selector: 'app-root',
  imports: [JiraContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'jira-reports';
}
