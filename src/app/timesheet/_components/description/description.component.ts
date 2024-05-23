import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TimesheetService } from "../../_service/timesheet.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface DialogData {
    // week_number: any;
    id: number;
    description: string;
    working_type: string;
    ot_number: number;
}

@Component({
    selector: "app-description",
    templateUrl: "./description.component.html",
    styleUrls: ["./description.component.scss"],
})
export class DescriptionComponent implements OnInit {
    formData!: FormGroup; // Using definite assignment assertion
    selectedType: string | undefined;

    constructor(
        private fb: FormBuilder,
        private timesheet: TimesheetService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dialogRef: MatDialogRef<DescriptionComponent>,
    ) {}

    ngOnInit(): void {
        this.createForm(); 

        this.selectedType = this.data.working_type
    }

    createForm(): void {
        this.formData = this.fb.group({
            description: [this.data.description, Validators.required],
            working_type: [this.data.working_type],
            ot_number: [this.data.ot_number]

        });
    }

    submitForm(): void {
        if (this.formData.valid) {
            const id = this.data.id;
            const params = this.formData.value;

            this.timesheet.editTimesheetEntry(id, params).subscribe({
                next: (response: any) => {
                    // console.log("Edit successfully:", response);
                    // this.openSnackBar("Succesfully updated 1 time entries", "okay");
                    this.dialogRef.close();
                },
                error: (error: any) => {
                    console.error("Error creating entry:", error);
                },
            });
        } else {
            console.log("Form is invalid. Please fill in all required fields.");
        }
    }
}
