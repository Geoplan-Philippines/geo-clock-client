import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeInValidationComponent } from './time-in-validation.component';

describe('TimeInValidationComponent', () => {
    let component: TimeInValidationComponent;
    let fixture: ComponentFixture<TimeInValidationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TimeInValidationComponent],
        });
        fixture = TestBed.createComponent(TimeInValidationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
