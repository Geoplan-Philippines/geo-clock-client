import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from 'src/app/timesheet/_components/delete-confirmation-modal/delete-confirmation-modal.component';
import { DescriptionComponent } from 'src/app/timesheet/_components/description/description.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openTimesheetEntryDescription(id: any, description: any) {
    const dialogRef = this.dialog.open(DescriptionComponent,{
      data: {
        id: id,
        description:description
    }
    });
    return dialogRef.afterClosed();
  }

  openDeleteConfirmation(id: any) {
    this.dialog.open(DeleteConfirmationModalComponent, {
      data: {
        id: id,
      },
    });
  }
}
