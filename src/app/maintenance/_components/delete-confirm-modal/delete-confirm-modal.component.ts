import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/service/snack-bar/snack-bar.service';
import { MaintenanceService } from '../../_service/maintenance.service';

export interface DeleteData {
    id: any;
    table: any;
}

@Component({
    selector: 'app-delete-confirm-modal',
    templateUrl: './delete-confirm-modal.component.html',
    styleUrls: ['./delete-confirm-modal.component.scss'],
})
export class DeleteConfirmModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DeleteData,
        private maintenanceService: MaintenanceService,
        private snackBarService: SnackBarService,
        private dialogRef: MatDialogRef<DeleteConfirmModalComponent>
    ) {}

    deleteEntry() {
        if (this.data && this.data.id && this.data.table) {
            console.log(this.data.id, this.data.table);
            this.maintenanceService.deleteData(this.data.id, this.data.table).subscribe({
                next: (response) => {
                    console.log('Entry successfully:', response);
                    this.dialogRef.close();
                    this.snackBarService.openSnackBar('Entry has been deleted', 'okay');
                },
                error: (error) => {
                    console.error('Error deleting entry:', error);
                },
            });
        } else {
            console.error('Invalid data: id or table is missing');
            this.snackBarService.openSnackBar('Invalid data: id or table is missing', 'error');
        }
    }
}
