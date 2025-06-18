export interface SprintIssueResponse {
    expand: string;
    startAt: number;
    maxResults: number;
    total: number;
    issues: SprintIssue[];
}

export interface SprintIssue {
    id: string;
    key: string;
    fields: Field;
}

export interface Field {
    statusCategory: StatusCategory;
    assignee: Assignee;
    worklog: Worklog;
    summary: string;
    timeoriginalestimate: number;
    timespent: number;
}

export interface Worklog {
    self: string;
    total: number;
    worklogs: WorklogItem[];
}

export interface WorklogItem {
    self: string;
    author: Assignee;
    started: Date;
    timeSpent: string;
    comment: string;
    timeSpentSeconds: number;
    issueId: string;
}

export interface Assignee {
    self: string;
    accountId: string;
    displayName: string;
}

export interface StatusCategory {
    id: number;
    key: string;
    name: string;
    colorName: string;
}