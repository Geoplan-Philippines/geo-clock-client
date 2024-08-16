import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChargingGeoplanComponent } from './project-charging-geoplan.component';

describe('ProjectChargingGeoplanComponent', () => {
    let component: ProjectChargingGeoplanComponent;
    let fixture: ComponentFixture<ProjectChargingGeoplanComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ProjectChargingGeoplanComponent],
        });
        fixture = TestBed.createComponent(ProjectChargingGeoplanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
