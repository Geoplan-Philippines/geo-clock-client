import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetSummaryComponent } from './timesheet-summary.component';

describe('TimesheetSummaryComponent', () => {
  let component: TimesheetSummaryComponent;
  let fixture: ComponentFixture<TimesheetSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimesheetSummaryComponent]
    });
    fixture = TestBed.createComponent(TimesheetSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
