import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AttendanceService } from '../../_service/attendance.service';
import { EncryptionService } from 'src/app/authentication/_guards/encrpytion.service';
import { SnackBarService } from 'src/app/shared/service/snack-bar/snack-bar.service';
import { DialogData } from '../attendance-type/attendance-type.component';

@Component({
    selector: 'app-existing-validation',
    templateUrl: './existing-validation.component.html',
    styleUrls: ['./existing-validation.component.scss'],
})
export class ExistingValidationComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private attendanceService: AttendanceService,
        private _snackBarService: SnackBarService,
        private encrypt: EncryptionService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialog: MatDialog
    ) {}
    ngOnInit(): void {}

    closeDialog() {
        this.dialog.closeAll();
    }
}
