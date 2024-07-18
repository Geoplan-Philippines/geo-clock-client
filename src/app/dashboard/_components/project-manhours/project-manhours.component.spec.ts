import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManhoursComponent } from './project-manhours.component';

describe('ProjectManhoursComponent', () => {
  let component: ProjectManhoursComponent;
  let fixture: ComponentFixture<ProjectManhoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectManhoursComponent]
    });
    fixture = TestBed.createComponent(ProjectManhoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
