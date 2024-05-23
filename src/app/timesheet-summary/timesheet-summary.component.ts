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
    dataSource = new MatTableDataSource<TimesheetSummaryModel>();
    displayedColumns: any[] = ["id", "Employee", "Code", "RG", "OT", "RD", "RH", "SH", "RHRD", "SHRD", "LVE", "ND", "Hours"];

    constructor(private timesheetSummaryService: TimesheetSummaryService) {}

    ngOnInit() {
        this.loadTImesheetSummary();
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
}
