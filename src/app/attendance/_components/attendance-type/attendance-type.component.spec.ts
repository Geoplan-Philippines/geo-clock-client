import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceTypeComponent } from './attendance-type.component';

describe('AttendanceTypeComponent', () => {
  let component: AttendanceTypeComponent;
  let fixture: ComponentFixture<AttendanceTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceTypeComponent]
    });
    fixture = TestBed.createComponent(AttendanceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
