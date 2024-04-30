import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TimesheetService } from "../../_service/timesheet.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface DialogData {
    id: number;
    description: string;
}

@Component({
    selector: "app-description",
    templateUrl: "./description.component.html",
    styleUrls: ["./description.component.scss"],
})
export class DescriptionComponent implements OnInit {
    formData!: FormGroup; // Using definite assignment assertion

    constructor(
        private fb: FormBuilder,
        private timesheet: TimesheetService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dialogRef: MatDialogRef<DescriptionComponent>,
    ) {}

    ngOnInit(): void {
        this.createForm(); // Initialize the form
        // console.log(this.data.id)
        // console.log(this.data.description)
    }

    createForm(): void {
        this.formData = this.fb.group({
            description: [this.data.description, Validators.required],
        });
    }

    submitForm(): void {
        if (this.formData.valid) {
            const id = this.data.id;
            const params = this.formData.value;

            console.log(id);
            console.log(params);

            this.timesheet.editTimesheetEntry(id, params).subscribe({
                next: (response: any) => {
                    console.log("Edit successfully:", response);
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
