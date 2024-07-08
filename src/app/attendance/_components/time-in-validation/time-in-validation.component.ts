import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AttendanceService } from "../../_service/attendance.service";
import { EncryptionService } from "src/app/authentication/_guards/encrpytion.service";
import { SnackBarService } from "src/app/shared/service/snack-bar/snack-bar.service";
import { ExistingValidationComponent } from "../existing-validation/existing-validation.component";

export interface DialogData {
    user_id: any;
    date: any;
    attendance_type: any;
    time_in: any;
    time_in_location: any;
}

@Component({
    selector: "app-time-in-validation",
    templateUrl: "./time-in-validation.component.html",
    styleUrls: ["./time-in-validation.component.scss"],
})
export class TimeInValidationComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private attendanceService: AttendanceService,
        private _snackBarService: SnackBarService,
        private encrypt: EncryptionService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dialogRef: MatDialogRef<TimeInValidationComponent>,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    timeInUpdate() {
        const user = this.data.user_id;
        const date = this.data.date;
        const type = this.data.attendance_type;
        const dataTimeIn = {
            user: this.data.user_id,
            date: this.data.date,
            attedance_type: this.data.attendance_type,
            time_in: this.data.time_in,
            time_in_location: this.data.time_in_location,
        };
        // console.log(`type ${type}`)
        // console.log(`date ${date}`)
        // console.log(`user ${user}`)
        // console.log("data time in",dataTimeIn)

        this.attendanceService.updateTimeInAttenadance(user, date, type, dataTimeIn).subscribe({
            next: (response: any) => {
                // console.log("Time In updated successfully:", response);
                this._snackBarService.openSnackBar("Time In Update Successfully", "okay");
                this.dialogRef.close();
            },
            error: (error: any) => {
                console.error("Error creating entry:", error);
                this.dialog.open(ExistingValidationComponent, {});

                // this.dialogRef.close();
            },
        });
    }
    closeDialog(): void {
        this.dialogRef.close();
    }
}
