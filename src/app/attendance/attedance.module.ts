import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceComponent } from './attendance.component'; 
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [AttendanceComponent],
  imports: [
    CommonModule, 
    SharedModule, 
    ReactiveFormsModule, 
    FormsModule, 
    MaterialModule, 
    MatTableModule, 
    MatPaginatorModule
  ],
  exports: [AttendanceComponent]
})
export class AttedanceModule { }
