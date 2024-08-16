import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TimesheetSummaryComponent } from './timesheet-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

@NgModule({
    declarations: [TimesheetSummaryComponent],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, MaterialModule],
    exports: [TimesheetSummaryComponent],
})
export class TimesheetSummaryModule {}
