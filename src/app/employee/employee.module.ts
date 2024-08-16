import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddComponent } from './_component/add/add.component';
import { EditComponent } from './_component/edit/edit.component';
import { MaskPasswordPipe } from './_pipe/mask-password.pipe';

@NgModule({
    declarations: [EmployeeComponent, AddComponent, EditComponent, MaskPasswordPipe],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        MatTableModule,
        MatPaginatorModule,
    ],
    exports: [EmployeeComponent],
})
export class EmployeeModule {}
