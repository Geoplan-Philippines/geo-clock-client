import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetApprovedComponent } from './timesheet-approved.component';

describe('TimesheetApprovedComponent', () => {
  let component: TimesheetApprovedComponent;
  let fixture: ComponentFixture<TimesheetApprovedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimesheetApprovedComponent]
    });
    fixture = TestBed.createComponent(TimesheetApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
