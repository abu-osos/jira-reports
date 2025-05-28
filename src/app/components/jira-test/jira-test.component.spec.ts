import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraTestComponent } from './jira-test.component';

describe('JiraTestComponent', () => {
  let component: JiraTestComponent;
  let fixture: ComponentFixture<JiraTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JiraTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JiraTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
