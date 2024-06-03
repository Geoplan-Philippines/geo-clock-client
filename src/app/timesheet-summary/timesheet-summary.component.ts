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
    yearNumber: any[] = [];

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

    loadTImesheetSummary(): void {
        this.timesheetSummaryService.getAllSummaryData().subscribe((res: TimesheetSummaryModel[]) => {
            const ds = res.map((item, index) => ({ ...item, id: index + 1 }));
            this.dataSource.data = ds;

            this.yearNumber = [...new Set(ds.map((item) => item.Date))]; // Assuming 'Date' is a property in TimesheetSummaryModel
        });
    }

    // loadTImesheetSummary() {
    //     this.timesheetSummaryService.getAllSummaryData().subscribe((res: any) => {
    //         const ds = res;
    //         this.dataSource = new MatTableDataSource<TimesheetSummaryModel>(ds);

    //         this.yearNumber = [...new Set(ds.map((item: { Date: any }) => item.Date))];

    //         // this.yearNumber = ds.Date;
    //         // console.log(this.yearNumber)
    //     });
    // }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     this.dataSource.filter = filterValue.trim().toLowerCase();
    // }

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
    selectYearNumber(event: any) {
        if (event == null) {
            this.loadTImesheetSummary();
        } else {
            const weekFilterValue = event.toString();
            this.dataSource.filterPredicate = (data: TimesheetSummaryModel, filter: string) => {
                return data.Date.toString().toLowerCase() === filter;
            };
            this.dataSource.filter = weekFilterValue.trim().toLowerCase();
            console.log(weekFilterValue);
            console.log(this.dataSource);
        }
    }
    copyClipboard() {
        const data = this.dataSource.data;
        const rows = data
            .map(
                (item, index) =>
                    `${index + 1}\t${item.Employee}\t${item.Code}\t${item.RG}\t${item.OT}\t${item.RD}\t${item.RH}\t${item.SH}\t${item.RHRD}\t${item.SHRD}\t${item.LVE}\t${item.ND}\t${item.Hours}`,
            )
            .join("\n");

        navigator.clipboard
            .writeText(rows)
            .then(() => {
                console.log("Data copied to clipboard");
            })
            .catch((err) => {
                console.error("Could not copy data to clipboard", err);
            });
    }
}
