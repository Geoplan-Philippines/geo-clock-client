import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHolidayModalComponent } from './update-holiday-modal.component';

describe('UpdateHolidayModalComponent', () => {
  let component: UpdateHolidayModalComponent;
  let fixture: ComponentFixture<UpdateHolidayModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateHolidayModalComponent]
    });
    fixture = TestBed.createComponent(UpdateHolidayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
