import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MaintenanceService } from "../../_service/maintenance.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as moment from "moment-timezone";
export interface updateData {
    id: any;
    dataHoliday: any;
    table: any;
}

@Component({
    selector: "app-update-holiday-modal",
    templateUrl: "./update-holiday-modal.component.html",
    styleUrls: ["./update-holiday-modal.component.scss"],
})
export class UpdateHolidayModalComponent implements OnInit {
    formData!: FormGroup<any>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: updateData,
        private fb: FormBuilder,
        private maintenanceService: MaintenanceService,
        private snackBar: MatSnackBar,
        public updatedialogRef: MatDialogRef<UpdateHolidayModalComponent>,
    ) {}

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2 * 1000,
            horizontalPosition: "left",
            verticalPosition: "top",
        });
    }

    ngOnInit(): void {
        this.updateForm();
        console.log(this.data.dataHoliday);
    }

    updateForm(): void {
        this.formData = this.fb.group({
            holiday_name: [this.data.dataHoliday.holiday_name],
            holiday_date: [this.data.dataHoliday.holiday_date],
            type: [this.data.dataHoliday.type],
        });
    }

    submitForm(): void {
        if (this.formData.valid) {
            const holidayData = this.formData.value;
            const holidayDataRep = {
              holiday_name: this.formData.value.holiday_name,
              holiday_date: moment(this.formData.value.holiday_date).tz("Asia/Manila").format('YYYY-MM-DDT00:00:00.000[Z]'),
              type: this.formData.value.type
            }
            console.log(holidayDataRep)

            this.maintenanceService.updateAllHolidays(this.data.id, holidayDataRep).subscribe({
                next: (response) => {
                    console.log("Data patched successfully:", response);
                    this.updatedialogRef.close();
                },
                error: (error) => {
                    console.error("Error patching data:", error);
                    this.openSnackBar("Error updating data", "Okay");
                },
            });
        } else {
            console.log("Form is invalid. Please fill in all required fields.");
        }
    }
}
