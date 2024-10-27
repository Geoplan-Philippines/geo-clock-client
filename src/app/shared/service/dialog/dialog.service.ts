import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from 'src/app/timesheet/_components/delete-confirmation-modal/delete-confirmation-modal.component';
import { DescriptionComponent } from 'src/app/timesheet/_components/description/description.component';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    dialogRef: any = MatDialogRef<any>;

    constructor(private dialog: MatDialog) {}

    openTimesheetEntryDescription(entryData: any) {
        const descriptionDialog = this.dialog.open(DescriptionComponent, {
            data: {
                id: entryData.id,
                description: entryData.description,
                working_location: entryData.working_location,
                working_type: entryData.working_type,
                nd_number: entryData.nd_number,
                ot_number: entryData.ot_number,
            },
        });
        return descriptionDialog.afterClosed();
    }

    openDeleteConfirmation(id: any) {
        this.dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
            data: {
                id: id,
            },
        });
        this.dialogRef.afterClosed().subscribe((result: any) => {
            console.log('Dialog was closed', result);
        });
    }
}
