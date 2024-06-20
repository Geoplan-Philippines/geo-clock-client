import { Component, OnDestroy, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { interval, Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { AttedanceModel } from "../models/attedance.model";
import { AttendanceService } from "./_service/attendance.service";
@Component({
    selector: "app-attendance",
    templateUrl: "./attendance.component.html",
    styleUrls: ["./attendance.component.scss"],
})
export class AttendanceComponent implements OnInit, OnDestroy {
    currentTime: string = "";
    currentDate: string = "";
    private timerSubscription: Subscription | undefined;

    dataSource = new MatTableDataSource<AttedanceModel>();
    displayedColumns: string[] = [
        "employee_name",
        "date",
        "time_in",
        "time_in_location",
        "time_out",
        "time_out_location",
        "total_hours",
    ];

    generalFilter: string = "";
    filterDate: string = "";

    constructor(
        private datePipe: DatePipe,
        private attendanceService: AttendanceService,
    ) {}

    ngOnInit(): void {
        this.updateTimeAndDate();
        // Update time and date every second
        this.timerSubscription = interval(1000).subscribe(() => {
            this.updateTimeAndDate();
        });

        this.loadAttendance();
    }
    // Clock time and date start
    ngOnDestroy(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

    private updateTimeAndDate(): void {
        const now = new Date();
        this.currentTime = this.datePipe.transform(now, "mediumTime")!;
        this.currentDate = this.datePipe.transform(now, "mediumDate")!;
    }
    // Clock time and date end

    // time in and time out click start

    // time in and time out click end

    // history table start
    loadAttendance() {
        this.attendanceService.getAllAttendanceData().subscribe((res: any) => {
            const ds = res.data;
            console.log(ds);

            this.dataSource = new MatTableDataSource<AttedanceModel>(ds);

            ds.map((item: any, index: number) => ({ ...item, id: index + 1 }));
            const filteredData = ds.filter((data: any) => {
                const matchesGeneralFilter = this.generalFilter
                    ? JSON.stringify(data).toLowerCase().includes(this.generalFilter)
                    : true;
                return matchesGeneralFilter;
            });
            this.dataSource.data = filteredData;
        });
    }

    // history table end

    //  search bar start
    applyFilter(event: any) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.generalFilter = filterValue;
        if (this.filterDate === "") {
            this.loadAttendance();
        } else {
            this.loadFilteringWithDate();
        }
    }

    selectDate(event: any) {
        if (event === null) {
            this.loadAttendance();
        } else {
            const yearFilterValue = this.datePipe.transform(event, "yyyy-MM-dd");
            this.filterDate = yearFilterValue as string;
            this.loadFilteringWithDate();
        }
        console.log("Date selected:", this.filterDate);
    }

    loadFilteringWithDate() {
        this.attendanceService.getAllAttendanceData().subscribe((res: any) => {
            const ds = res.data;
            console.log(ds);

            this.dataSource = new MatTableDataSource<AttedanceModel>(ds);
            if (this.generalFilter === null || "") {
                ds.map((item: any, index: number) => ({ ...item, id: index + 1 }));
                const filteredData = ds.filter((data: any) => {
                    console.log(this.filterDate);
                    if (data.date) {
                        const matchesDate = data.date.toString().toLowerCase().includes(this.filterDate.toLowerCase());
                        return matchesDate;
                    }
                    return false;
                });

                this.dataSource.data = filteredData;
            } else {
                ds.map((item: any, index: number) => ({ ...item, id: index + 1 }));
                const filteredData = ds.filter((data: any) => {
                    console.log(this.filterDate);
                    if (data.date) {
                        const matchesDate = data.date.toString().toLowerCase().includes(this.filterDate.toLowerCase());
                        const matchesGeneralFilter = this.generalFilter
                            ? JSON.stringify(data).toLowerCase().includes(this.generalFilter)
                            : true;
                        return matchesDate && matchesGeneralFilter;
                    }
                    return false;
                });

                this.dataSource.data = filteredData;
            }
        });
    }
    //  search bar end
}
