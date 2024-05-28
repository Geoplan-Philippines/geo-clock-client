import { Component } from "@angular/core";
import { TimesheetSummaryModel } from "../models/timesheet-summary.model";
import { MatTableDataSource } from "@angular/material/table";
import { TimesheetSummaryService } from "../timesheet-summary/_service/timesheet-summary.service";

@Component({
    selector: "app-timesheet-summary",
    templateUrl: "./timesheet-summary.component.html",
    styleUrls: ["./timesheet-summary.component.scss"],
})
export class TimesheetSummaryComponent {
    weekNumber: any[] = [];


    dataSource = new MatTableDataSource<TimesheetSummaryModel>();
    displayedColumns: any[] = ["id", "Employee", "Code", "RG", "OT", "RD", "RH", "SH", "RHRD", "SHRD", "LVE", "ND", "Hours"];


    constructor(private timesheetSummaryService: TimesheetSummaryService) {}

    ngOnInit() {
        this.loadTImesheetSummary();
        this.loadWeekNumbers();
    }

    loadWeekNumbers() {
        this.timesheetSummaryService.WeekNumberService().subscribe((res: any) => {
            const ds = res.data;
            this.weekNumber = ds;
        });
    }

    loadTImesheetSummary() {
        this.timesheetSummaryService.getAllSummaryData().subscribe((res: any) => {
            const ds = res;
            this.dataSource = new MatTableDataSource<TimesheetSummaryModel>(ds);
            console.log(this.dataSource);
        });
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    selectWeekNumber(event: any) {
        if (event == null) {
            this.loadTImesheetSummary();
        } else {
            const weekFilterValue = event.toString();
            this.dataSource.filterPredicate = (data: TimesheetSummaryModel, filter: string) => {
                return data.Week_no.toString().toLowerCase() === filter;
            };
            this.dataSource.filter = weekFilterValue.trim().toLowerCase();
            console.log(weekFilterValue);
            console.log(this.dataSource);
        }
    }
}
