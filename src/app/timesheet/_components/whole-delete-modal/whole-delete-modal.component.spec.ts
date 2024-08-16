import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholeDeleteModalComponent } from './whole-delete-modal.component';

describe('WholeDeleteModalComponent', () => {
    let component: WholeDeleteModalComponent;
    let fixture: ComponentFixture<WholeDeleteModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WholeDeleteModalComponent],
        });
        fixture = TestBed.createComponent(WholeDeleteModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
