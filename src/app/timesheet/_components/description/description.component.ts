import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TimesheetService } from "../../_service/timesheet.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SnackBarService } from "src/app/shared/service/snack-bar/snack-bar.service";
import { Subscription } from "rxjs";

export interface DialogData {
    // week_number: any;
    id: number;
    description: string;
    working_location: string;
    working_type: string;
    ot_number: number;
    nd_number:number;
}

@Component({
    selector: "app-description",
    templateUrl: "./description.component.html",
    styleUrls: ["./description.component.scss"],
})
export class DescriptionComponent implements OnInit {
    formData!: FormGroup; // Using definite assignment assertion
    selectedWorking: string | undefined;
    selectedType: string | undefined;
    subscription: Subscription | undefined;


    constructor(
        private fb: FormBuilder,
        private timesheet: TimesheetService,
        public snackbarService: SnackBarService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dialogRef: MatDialogRef<DescriptionComponent>,
    ) {}

    ngOnInit(): void {
        this.createForm(); 

        this.selectedWorking = this.data.working_location
        this.selectedType = this.data.working_type

        this.subscription = this.formData.get('working_type')?.valueChanges.subscribe((value) => {
            this.selectedType = value;
            if (value === 'RG') {
                this.formData.patchValue({ nd_number: this.data.nd_number});
            } else {
                this.formData.patchValue({ nd_number: 0 });
            }
            
            if (value === 'OT') {
                this.formData.patchValue({ ot_number: this.data.ot_number });
            } else {
                this.formData.patchValue({ ot_number: 0 });
            }
            
            if (value === 'OT') {
                this.formData.patchValue({ ot_number: 0 });
            }
        });

    }


    createForm(): void {
        this.formData = this.fb.group({
            description: [this.data.description, Validators.required],
            working_location: [this.data.working_location],
            working_type: [this.data.working_type],
            ot_number: [this.data.ot_number],
            nd_number: [this.data.nd_number]

        });
        // console.log("sadasd",this.data.nd_number);
    }

    submitForm(): void {
        if (this.formData.valid) {
            const id = this.data.id;
            const params = this.formData.value;
            // console.log("paramstesting",params)
            this.timesheet.editTimesheetEntry(id, params).subscribe({
                next: (response: any) => {
                    // console.log("Edit successfully:", response);
                    this.snackbarService.openSnackBar("Succesfully updated 1 time entries", "okay");
                    this.dialogRef.close();
                },
                error: (error: any) => {
                    this.snackbarService.openSnackBar("Unsuccesfully updated. Please check your input", "okay");
                    console.error("Error creating entry:", error);
                },
            });
        } else {
            console.log("Form is invalid. Please fill in all required fields.");
        }
    }
}
