import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TimesheetService } from "../../_service/timesheet.service";
import { SnackBarService } from "src/app/shared/service/snack-bar/snack-bar.service";

export interface DeleteData {
    id: any;
}

@Component({
    selector: "app-delete-confirmation-modal",
    templateUrl: "./delete-confirmation-modal.component.html",
    styleUrls: ["./delete-confirmation-modal.component.scss"],
})
export class DeleteConfirmationModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DeleteData,
        public timesheetService: TimesheetService,
        private snackBarService: SnackBarService,
        private dialogRef: MatDialogRef<DeleteConfirmationModalComponent>,
    ) {}
    deleteEntry() {
        console.log();
        this.timesheetService.deleteTimesheetEntry(this.data.id).subscribe({
            next: (response) => {
                console.log("Entry successfully:", response);
                this.dialogRef.close();
                this.snackBarService.openSnackBar("Entry has been deleted", "okay");
            },
            error: (error) => {
                console.error("Error creating entry:", error);
            },
        });
    }
}
