import { Component, Inject } from '@angular/core';
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogModule,
} from '@angular/material/dialog';
import { MaintenanceService } from '../../_service/maintenance.service';
import { SnackBarService } from 'src/app/shared/service/snack-bar/snack-bar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

export interface UpdateData {
    id: any;
    start_time: any;
    out_time: any;
}

@Component({
    selector: 'app-update-modal',
    templateUrl: './update-modal.component.html',
    styleUrls: ['./update-modal.component.scss'],
})
export class UpdateModalComponent {
    formData!: FormGroup;

    time: string | undefined;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: UpdateData,
        private maintenanceService: MaintenanceService,
        private snackBarService: SnackBarService,
        public dialog: MatDialog,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        const getStartTime = this.data.start_time;
        const getEndTime = this.data.out_time;
        const startTime = moment.utc(getStartTime).format('HH:mm');
        const endTime = moment.utc(getEndTime).format('HH:mm');

        this.formData = this.fb.group({
            start_time: [startTime, Validators.required],
            end_time: [endTime, Validators.required],
        });
    }

    submitForm(): void {
        if (this.formData.valid) {
            // Handle form submission
            const id = this.data.id;
            const startTimeValue = `2000-01-01T${this.formData.value.start_time}:00.000Z`;
            const endTimeValue = `2000-01-01T${this.formData.value.end_time}:00.000Z`;
            console.log(`sampleStart ${startTimeValue}`);
            console.log(`sampleEnd ${endTimeValue}`);

            const time = {
                start_time: startTimeValue,
                end_time: endTimeValue,
            };

            this.maintenanceService.updateAllDifferentialData(id, time).subscribe({
                next: (response) => {
                    this.snackBarService.openSnackBar('Successfully Updated', 'Okay');
                    this.dialog.closeAll();
                },
                error: (error) => {
                    console.error('Error patching data:', error);
                    this.snackBarService.openSnackBar('Existing Time', 'Okay');
                    this.dialog.closeAll();
                },
            });
        }
    }
}
