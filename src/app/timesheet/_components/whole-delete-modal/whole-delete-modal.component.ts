import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeleteData } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { TimesheetService } from '../../_service/timesheet.service';
import { SnackBarService } from 'src/app/shared/service/snack-bar/snack-bar.service';
import { WholeDeleteService } from './_service/whole-delete.service'; 

export interface datadialog{
  user_id: number,
  project_id: number,
  start_date: any,
  end_date: any
}

@Component({
  selector: 'app-whole-delete-modal',
  templateUrl: './whole-delete-modal.component.html',
  styleUrls: ['./whole-delete-modal.component.scss']
})
export class WholeDeleteModalComponent{
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: datadialog,
    public wholeDeleteService: WholeDeleteService,
    private snackBarService: SnackBarService,
    private dialogRef: MatDialogRef<WholeDeleteModalComponent>
) {}
deleteEntry() {
      const userId = this.data.user_id
      const projectId = this.data.project_id    
      const startDate = this.data.start_date;
      const endDate = this.data.end_date;

      console.log("User ID:", userId);
console.log("Project ID:", projectId);
console.log("Start Date:", startDate);
console.log("End Date:", endDate);



  this.wholeDeleteService.deleteTimesheetEntry(userId,projectId,startDate,endDate).subscribe(
    (response) => {
      console.log('Deletion successful:', response);
                 this.dialogRef.close();
            this.snackBarService.openSnackBar("Entry has been whole week deleted", "okay");
    },
    (error) => {
      console.error('Deletion error:', error);
    }
  );

    
}
}
