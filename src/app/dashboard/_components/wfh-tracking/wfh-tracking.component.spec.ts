import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfhTrackingComponent } from './wfh-tracking.component';

describe('WfhTrackingComponent', () => {
    let component: WfhTrackingComponent;
    let fixture: ComponentFixture<WfhTrackingComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WfhTrackingComponent],
        });
        fixture = TestBed.createComponent(WfhTrackingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
