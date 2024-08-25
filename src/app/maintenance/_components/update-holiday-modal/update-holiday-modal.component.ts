import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaintenanceService } from '../../_service/maintenance.service';
import { SnackBarService } from 'src/app/shared/service/snack-bar/snack-bar.service';

export interface updateData {
  id: any;
  dataHoliday: any;
  table: any;
}

@Component({
  selector: 'app-update-holiday-modal',
  templateUrl: './update-holiday-modal.component.html',
  styleUrls: ['./update-holiday-modal.component.scss']
})
export class UpdateHolidayModalComponent implements OnInit{
formData!: FormGroup<any>;

constructor(
  @Inject(MAT_DIALOG_DATA) public data: updateData,
  private maintenanceService: MaintenanceService,
  private snackBarService: SnackBarService,
  private dialogRef: MatDialogRef<UpdateHolidayModalComponent>,
) {}


 ngOnInit(): void{
  console.log(this.data.dataHoliday)
 }

 submitForm() {
  throw new Error('Method not implemented.');
  }
}
