import { Component, Inject, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SummaryModel } from "src/app/models/summary.model";
import { SummaryService } from "./_service/summary.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData{
    week_number: number,
    user_id: number,
    start_date: Date,
    end_date: Date,
}

@Component({
    selector: "app-summary",
    templateUrl: "./summary.component.html",
    styleUrls: ["./summary.component.scss"],
})
export class SummaryComponent implements OnInit{
    dataSource = new MatTableDataSource<SummaryModel>();
    employeeEntry: any;
    constructor(private SummaryService: SummaryService, @Inject(MAT_DIALOG_DATA) public data: DialogData,) {}
    ngOnInit() {
        this.loadTimesheet();
    }

    loadTimesheet() {

        const weekNumber = this.data.week_number
        const userId = this.data.user_id
        const startDate = this.data.start_date
        const endDate = this.data.end_date

        this.SummaryService.getAllTimesheetDaily(weekNumber, userId, startDate, endDate).subscribe((res: any) => {
            const ds = res;
            this.employeeEntry = ds;
        
            // Extract timesheetEntries array
            const timesheetEntries = ds[0]?.timesheetEntries || [];
        
            // Assuming timesheetEntries is the array you want to loop through
            timesheetEntries.forEach((entry: any) => {
                // Do something with each entry here
                console.log(entry);
            });
        
            // Update the dataSource with timesheetEntries
            this.dataSource = new MatTableDataSource<SummaryModel>(timesheetEntries);
            console.log(this.dataSource);
        });
    }

    displayedColumns: any[] = [
        "project_name",
        "aproved_by",
        "is_approved",
        "over_time",
        "night_diff",
        "date_created",
        "actual_hours",
        "discription",
    ];
}
