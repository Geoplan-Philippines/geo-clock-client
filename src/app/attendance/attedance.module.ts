import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceComponent } from './attendance.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AttendanceTypeComponent } from './_components/attendance-type/attendance-type.component';
import { TimeInValidationComponent } from './_components/time-in-validation/time-in-validation.component';
import { ExistingValidationComponent } from './_components/existing-validation/existing-validation.component';
import { TimeOutValidationComponent } from './_components/time-out-validation/time-out-validation.component';

@NgModule({
    declarations: [
        AttendanceComponent,
        AttendanceTypeComponent,
        TimeInValidationComponent,
        ExistingValidationComponent,
        TimeOutValidationComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        MatTableModule,
        MatPaginatorModule,
    ],
    exports: [AttendanceComponent],
})
export class AttedanceModule {}
