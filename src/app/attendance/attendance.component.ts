import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, OnDestroy {
  currentTime: string = '';
  currentDate: string = '';
  private timerSubscription: Subscription | undefined;

  dataSource = new MatTableDataSource();
  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.updateTimeAndDate(); // Initial update

    // Update time and date every second
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateTimeAndDate();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from timer to avoid memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private updateTimeAndDate(): void {
    const now = new Date();
    this.currentTime = this.datePipe.transform(now, 'mediumTime')!;
    this.currentDate = this.datePipe.transform(now, 'mediumDate')!;
  }
}
