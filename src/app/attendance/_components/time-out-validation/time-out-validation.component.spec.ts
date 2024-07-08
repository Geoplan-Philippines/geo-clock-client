import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOutValidationComponent } from './time-out-validation.component';

describe('TimeOutValidationComponent', () => {
  let component: TimeOutValidationComponent;
  let fixture: ComponentFixture<TimeOutValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeOutValidationComponent]
    });
    fixture = TestBed.createComponent(TimeOutValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
