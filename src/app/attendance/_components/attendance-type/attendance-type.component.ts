import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AttendanceService } from "../../_service/attendance.service";
import { EncryptionService } from "src/app/authentication/_guards/encrpytion.service";
import { SnackBarService } from "src/app/shared/service/snack-bar/snack-bar.service";

export interface DialogData {
  date: any,
  time_out: any,
  time_out_location: string,
  total_hours: number
}

@Component({
  selector: 'app-attendance-type',
  templateUrl: './attendance-type.component.html',
  styleUrls: ['./attendance-type.component.scss']
})
export class AttendanceTypeComponent implements OnInit {

 

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private _snackBarService: SnackBarService,
    private encrypt: EncryptionService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<AttendanceTypeComponent>,
) {}

  ngOnInit(): void {
    this.dataTimeout();
  }

  dataTimeout(){
    const dataTimeOut = {
      date: this.data.date,
      time_out: this.data.time_out,
      time_out_location: this.data.time_out_location,
      total_hours: this.data.total_hours
    }
    return dataTimeOut;
  }

  submitFormButton(typeString: string){
    const user = this.encrypt.getItem("id");
    const type = typeString;
    const date = this.data.date

    const data = this.dataTimeout();

   
    // console.log(`user: ${user}, type: ${type}, date: ${date}`)

    // console.log("data sheet",data)
    this.attendanceService.updateAllAttendanceData(user, date, type, data).subscribe({
      next: (response: any) => {
          // console.log("Time out successfully:", response);
          this._snackBarService.openSnackBar("Time Out Update Successfully", "okay");
          this.dialogRef.close();
      },
      error: (error: any) => {
          console.error("Error creating entry:", error);
          this.dialogRef.close();
      }
  });
 
  }

}
