import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-page-load',
  standalone: true,
  imports:[MatProgressSpinnerModule],
  templateUrl: './page-load.component.html',
})
export class PageLoadComponent implements OnInit {
  label!: string
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  
    ngOnInit(): void {
      this.label = this.data.label
        };
      }
  //dinagdagan ko