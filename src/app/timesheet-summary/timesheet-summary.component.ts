import { Component } from "@angular/core";
import { TimesheetSummaryModel } from "../models/timesheet-summary.model";
import { MatTableDataSource } from "@angular/material/table";
import { TimesheetSummaryService } from "../timesheet-summary/_service/timesheet-summary.service";
import { weekNumber } from "weeknumber";

@Component({
    selector: "app-timesheet-summary",
    templateUrl: "./timesheet-summary.component.html",
    styleUrls: ["./timesheet-summary.component.scss"],
})
export class TimesheetSummaryComponent {
    weekNumber: any[] = [];
    yearNumber: any[] = [];


    filterYear: string = '';
    filterWeek: string = '';

    latestYearNumber: string = '';
    latestWeekNumber: string = '';

    dataSource = new MatTableDataSource<TimesheetSummaryModel>();
    displayedColumns: any[] = ["id", "Employee", "Code", "RG", "OT", "RD", "RH", "SH", "RHRD", "SHRD", "LVE", "ND", "Hours"];

    constructor(private timesheetSummaryService: TimesheetSummaryService) {}

    ngOnInit() {
        const date = new Date();
        this.latestYearNumber = date.getFullYear().toString();
        this.latestWeekNumber = weekNumber(date).toString();

        this.loadWeekNumbers();
        this.loadTimesheetSummary();
        this.loadFilterSummaryYear();
    }

    loadWeekNumbers() {
        this.timesheetSummaryService.WeekNumberService().subscribe((res: any) => {
            const ds = res.data;
            this.weekNumber = ds;
        });
    }

    loadFilterSummaryYear(){
         this.timesheetSummaryService.getAllSummaryData().subscribe((res: TimesheetSummaryModel[]) => {
            const ds = res.map((item, index) => ({ ...item, id: index + 1 }));
            // this.dataSource.data = ds;
            
            this.yearNumber = [...new Set(ds.map((item) => item.Date))]; 
        });
    }


    loadTimesheetSummary() {
        this.timesheetSummaryService.getFilteringYearAndWeek(this.latestWeekNumber, this.latestYearNumber).subscribe((res: TimesheetSummaryModel[]) =>{
            const ds = res.map((item, index) => ({ ...item, id: index + 1 }));
            this.dataSource.data = ds;
        })

    }

   

    selectWeekNumber(event: any) {
        if (event == null) {
            this.loadTimesheetSummary();
        } else {
            this.filterWeek = event.value;
            const weekFilterValue = event.value.toString();

            let filterYear = this.filterYear || this.latestYearNumber;


            console.log(weekFilterValue);
            console.log(filterYear);
            console.log("a",this.latestYearNumber)
    
            this.timesheetSummaryService.getFilteringYearAndWeek(weekFilterValue, filterYear).subscribe((res: TimesheetSummaryModel[]) => {
                const ds = res.map((item, index) => ({ ...item, id: index + 1 }));
                this.dataSource.data = ds;
    
                this.dataSource.filterPredicate = (data: TimesheetSummaryModel, filter: string) => {
                    return data.Week_no.toString().toLowerCase() === filter;
                };
                this.dataSource.filter = weekFilterValue;
    
                console.log("Week filter applied:", weekFilterValue);
                console.log(this.dataSource.data);
            });
        }
    
        console.log("End of selectWeekNumber method.");
    }
    
    selectYearNumber(event: any) {
        if (event == null) {
            this.loadTimesheetSummary();
        } else {
            const yearFilterValue = event.value.toString();
            console.log(event);
            console.log(this.filterWeek);
            

            let filterWeek = this.filterWeek || this.latestWeekNumber;

              console.log(filterWeek);
              console.log("a", this.latestWeekNumber)

            this.timesheetSummaryService.getFilteringYearAndWeek(filterWeek, yearFilterValue).subscribe((res: TimesheetSummaryModel[]) => {
                const ds = res.map((item, index) => ({ ...item, id: index + 1 }));
                this.dataSource.data = ds;
    
                this.dataSource.filterPredicate = (data: TimesheetSummaryModel, filter: string) => {
                    return data.Date.toString().toLowerCase().includes(filter);
                };
                this.dataSource.filter = yearFilterValue;
    
                console.log("Year filter applied:", yearFilterValue);
                console.log(this.dataSource.data);
            });
    
            this.filterYear = yearFilterValue;
            console.log(this.filterWeek);
        }
    
        console.log("End of selectYearNumber method.");
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
