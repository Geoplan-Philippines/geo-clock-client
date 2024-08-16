import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadsupDialogComponent } from './headsup-dialog.component';

describe('HeadsupDialogComponent', () => {
    let component: HeadsupDialogComponent;
    let fixture: ComponentFixture<HeadsupDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeadsupDialogComponent],
        });
        fixture = TestBed.createComponent(HeadsupDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
