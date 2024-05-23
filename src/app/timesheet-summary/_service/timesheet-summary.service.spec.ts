import { TestBed } from '@angular/core/testing';

import { TimesheetSummaryService } from './timesheet-summary.service';

describe('TimesheetSummaryService', () => {
  let service: TimesheetSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimesheetSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
