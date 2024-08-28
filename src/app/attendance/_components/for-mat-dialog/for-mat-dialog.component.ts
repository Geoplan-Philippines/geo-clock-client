import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from '../../_service/attendance.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/service/snack-bar/snack-bar.service';
import * as moment from 'moment';

export interface DialogData{
  id:any
  comment: any
  date: any
  user_id1: number,
  user_id2: number
}


@Component({
  selector: 'app-for-mat-dialog',
  templateUrl: './for-mat-dialog.component.html',
  styleUrls: ['./for-mat-dialog.component.scss']
})
export class ForMatDialogComponent implements OnInit{
  // Property to control input field visibility
  public comment: boolean = false;
  public showInput: boolean = false;
  public toggleBtn: boolean = false;
  formData!: FormGroup;
  commentData: any;
  
  constructor(
    private fb: FormBuilder,
    private snackbar: SnackBarService,
    private attendanceService: AttendanceService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public updatedialogRef: MatDialogRef<ForMatDialogComponent>,
) {}

  // Method to toggle the input field
  toggleInput() {
    this.showInput = true;
    this.comment = true;
  }

  ngOnInit(): void {
    this.updateForm();
    this.loadAttendance();
    this.commentData = this.data.comment;
  }

  updateForm(): void{
    this.formData = this.fb.group({
      comment: [this.data.comment]
    })
  }
  
  submitForm() {
      this.attendanceService.updateAllDataAttendanceComment(this.data.id, this.formData.value).subscribe({
        next: (response) => {
          console.log("Data patched successfully:", response);
          this.snackbar.openSnackBar('Successfully Commented', 'okay');
          this.updatedialogRef.close(); 
      },
      error: (error) => {
          console.error("Error patching data:", error);
          this.snackbar.openSnackBar('Your Comment has a Limit', 'okay');
      },
      })
    }

    loadAttendance(){
      this.attendanceService.getAllAttendanceData(this.data.date).subscribe((res: any) =>{
        const ds = res;
      
        const userIdMatch = ds.find((user: any) => user.user_id ===this.data.user_id1 && user.id === this.data.id);
        console.log('69', userIdMatch)
        if(userIdMatch){
          this.toggleBtn = true
        }else{
          this.toggleBtn = false
        }
      })
    }
}
