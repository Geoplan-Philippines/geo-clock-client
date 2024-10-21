import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageLoadComponent } from 'src/app/page-load/page-load.component';

@Injectable({
  providedIn: 'root'
})
export class LoadPageService {
  loader?: MatDialogRef<any>
  constructor(private dialog: MatDialog) {}

  openLoad(label: string = "Loading..."): void {
    this.loader = this.dialog.open(PageLoadComponent, {
      data: { label },
      panelClass: 'loading-wrapper',
      hasBackdrop: true,
      disableClose: true,
    });

  }

  closeLoad(): void {
    this.loader?.close()
  }
}