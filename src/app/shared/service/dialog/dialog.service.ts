import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DeleteConfirmationModalComponent } from "src/app/timesheet/_components/delete-confirmation-modal/delete-confirmation-modal.component";
import { DescriptionComponent } from "src/app/timesheet/_components/description/description.component";

@Injectable({
    providedIn: "root",
})
export class DialogService {
    dialogRef: any = MatDialogRef<any>;

    constructor(private dialog: MatDialog) {}

    openTimesheetEntryDescription(id: any, description: any) {
        const descriptionDialog = this.dialog.open(DescriptionComponent, {
            data: {
                id: id,
                description: description,
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
            console.log("Dialog was closed", result);
        });
    }
}
