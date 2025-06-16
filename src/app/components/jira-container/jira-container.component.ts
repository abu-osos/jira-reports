import { Component, inject, linkedSignal, resource } from '@angular/core';
import { JiraService } from '../../services/jira.service';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-jira-container',
  imports: [],
  templateUrl: './jira-container.component.html',
  styleUrl: './jira-container.component.scss'
})
export class JiraContainerComponent {
  jiraService = inject(JiraService);
}
