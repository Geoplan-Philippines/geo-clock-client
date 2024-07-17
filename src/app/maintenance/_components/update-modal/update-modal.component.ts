import { Component, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { MaintenanceService } from '../../_service/maintenance.service';
import { SnackBarService } from 'src/app/shared/service/snack-bar/snack-bar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface UpdateData {
  id: any;
  start_time: any;
  out_time: any;
}


@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.scss']
})
export class UpdateModalComponent {


  formData!: FormGroup

  time: string | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UpdateData,
    private maintenanceService: MaintenanceService,
    private snackBarService: SnackBarService,
    private dialogRef: MatDialogRef<UpdateModalComponent>,
    private fb: FormBuilder
) {}





ngOnInit(): void {
  this.formData = this.fb.group({
    employee_code: ['', Validators.required],
    first_name: ['', Validators.required]
  });
}


submitForm(): void {
  if (this.formData.valid) {
    // Handle form submission
    console.log(this.formData.value);
  }
}

}
