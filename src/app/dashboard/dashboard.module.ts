import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { WfhTrackingComponent } from './_components/wfh-tracking/wfh-tracking.component';
import { ProjectChargingGeoplanComponent } from './_components/project-charging-geoplan/project-charging-geoplan.component';


@NgModule({
  declarations: [DashboardComponent, WfhTrackingComponent, ProjectChargingGeoplanComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    NgApexchartsModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
