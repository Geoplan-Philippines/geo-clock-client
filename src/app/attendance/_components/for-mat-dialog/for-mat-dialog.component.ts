import { Component } from '@angular/core';

@Component({
  selector: 'app-for-mat-dialog',
  templateUrl: './for-mat-dialog.component.html',
  styleUrls: ['./for-mat-dialog.component.scss']
})
export class ForMatDialogComponent {
  public comment: boolean = false;
  public showInput: boolean = false; // Property to control input field visibility

  // Method to toggle the input field
  toggleInput() {
    this.showInput = true;
    this.comment = true;
  }
  
}
