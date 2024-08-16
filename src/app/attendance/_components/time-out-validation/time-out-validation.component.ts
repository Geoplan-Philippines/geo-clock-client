import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AttendanceService } from '../../_service/attendance.service';
import { EncryptionService } from 'src/app/authentication/_guards/encrpytion.service';
import { SnackBarService } from 'src/app/shared/service/snack-bar/snack-bar.service';
import { AttendanceTypeComponent } from '../attendance-type/attendance-type.component';

export interface DialogData {
    date: any;
    attendance_type: any;
    time_out: any;
    time_out_location: string;
    total_hours: number;
}

@Component({
    selector: 'app-time-out-validation',
    templateUrl: './time-out-validation.component.html',
    styleUrls: ['./time-out-validation.component.scss'],
})
export class TimeOutValidationComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private attendanceService: AttendanceService,
        private _snackBarService: SnackBarService,
        private encrypt: EncryptionService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dialogRef: MatDialogRef<TimeOutValidationComponent>,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
    //   dataTimeout(){
    //     const dataTimeOut = {
    //       date: this.data.date,
    //       attendance_type: this.data.attendance_type,
    //       time_out: this.data.time_out,
    //       time_out_location: this.data.time_out_location,
    //       total_hours: this.data.total_hours
    //     }
    //     return dataTimeOut;
    //   }
    //     timeInUpdate() {
    //       const user = this.encrypt.getItem("id");
    //     const type = this.data.attendance_type;
    //     const date = this.data.date

    //     const data = this.dataTimeout();
    //       // console.log(`type ${type}`)
    //       // console.log(`date ${date}`)
    //       // console.log(`user ${user}`)
    //       // console.log("data time in",dataTimeIn)

    //       this.attendanceService.updateAlreadyDataAttenadance(user, date, type, data).subscribe({
    //           next: (response: any) => {
    //               // console.log("Time In updated successfully:", response);
    //               this._snackBarService.openSnackBar("Time Out Update Successfully", "okay");
    //               this.dialogRef.close();
    //           },
    //           error: (error: any) => {
    //               console.error("Error creating entry:", error);
    //               this.timeOutTypeChange(data, date)

    //               // this.dialogRef.close();
    //           },
    //       });
    //   }
    //   closeDialog(): void {
    //       this.dialogRef.close();
    //   }

    //   timeOutTypeChange(data: any, date: any){
    //     const descriptionDialog = this.dialog.open(AttendanceTypeComponent, {
    //         data: {
    //             date:date,
    //             time_out: data.time_out,
    //             time_out_location: data.time_out_location,
    //             total_hours: data.total_hours
    //         },
    //     });
    //     return descriptionDialog
    // }
}
