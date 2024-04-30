import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SummaryModel } from "src/app/models/summary.model";
import { SummaryService } from "./_service/summary.service";

@Component({
    selector: "app-summary",
    templateUrl: "./summary.component.html",
    styleUrls: ["./summary.component.scss"],
})
export class SummaryComponent {
    dataSource = new MatTableDataSource<SummaryModel>();
    employeeEntry: any;
    constructor(private SummaryService: SummaryService) {}
    ngOnInit() {
        this.loadTimesheet();
    }
    loadTimesheet() {
        this.SummaryService.getAllTimesheetDaily().subscribe((res: any) => {
            const ds = res.data;
            this.employeeEntry = ds;
            this.dataSource = new MatTableDataSource<SummaryModel>(ds);
            console.log(ds);
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
