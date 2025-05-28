import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JiraTestComponent } from './components/jira-test/jira-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JiraTestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'jira-reports';
}
