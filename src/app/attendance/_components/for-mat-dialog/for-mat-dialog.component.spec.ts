import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForMatDialogComponent } from './for-mat-dialog.component';

describe('ForMatDialogComponent', () => {
  let component: ForMatDialogComponent;
  let fixture: ComponentFixture<ForMatDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForMatDialogComponent]
    });
    fixture = TestBed.createComponent(ForMatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
