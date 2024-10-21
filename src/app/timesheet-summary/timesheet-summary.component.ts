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
    displayedColumns: any[] = ["id", "Department" ,"Employee", "Code", "RG", "OT", "RD", "RH", "SH", "RHRD", "SHRD", "LVE", "ND", "Hours"];

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
        this.timesheetSummaryService.getFilteringYearAndWeek(this.latestWeekNumber, this.latestYearNumber).subscribe((res: TimesheetSummaryModel[]) => {
            let ds = res.map((item, index) => ({ ...item, id: index + 1 }));
    
            this.timesheetSummaryService.getAllemployeetDataaaa().subscribe((employeeRes: any) => {
                const activeEmployees = employeeRes.filter((employee: any) => employee.is_active === true);
                const summaryMap = new Map(ds.map((summary: any) => [summary.user_id, summary]));
    
                // Initialize a counter to start from 1
                let loopNumber = 1;
    
                const combinedDs = activeEmployees.map((employee: any, index: number) => {
                    const existingSummary = summaryMap.get(employee.id);
                    return {
                        LoopNumber: loopNumber++, // Sequential number starting from 1
                        Code: employee.employee_code,
                        Date: this.latestYearNumber,
                        Department: employee.department,
                        Employee: employee.first_name + ' ' + employee.last_name,
                        Hours: existingSummary ? existingSummary.Hours : 0,
                        LVE: existingSummary ? existingSummary.LVE : 0,
                        ND: existingSummary ? existingSummary.ND : 0,
                        OT: existingSummary ? existingSummary.OT : 0,
                        RD: existingSummary ? existingSummary.RD : 0,
                        RG: existingSummary ? existingSummary.RG : 0,
                        RH: existingSummary ? existingSummary.RH : 0,
                        RHRD: existingSummary ? existingSummary.RHRD : 0,
                        SH: existingSummary ? existingSummary.SH : 0,
                        SHRD: existingSummary ? existingSummary.SHRD : 0,
                        Week_no: this.latestWeekNumber,
                        id: activeEmployees.length - index, // id descending
                        user_id: employee.id
                    };
                });
    
                combinedDs.sort((a: { Employee?: string }, b: { Employee?: string }) => {
                    const lastNameA = (a.Employee?.split(' ').pop() || '').toLowerCase();
                    const lastNameB = (b.Employee?.split(' ').pop() || '').toLowerCase();
                    return lastNameA.localeCompare(lastNameB);
                });
    
                this.dataSource.data = combinedDs;
                console.log('Sorted combined dataset:', combinedDs);
            });
        });
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
            console.log("a", this.latestYearNumber);
    
            this.timesheetSummaryService.getFilteringYearAndWeek(weekFilterValue, filterYear).subscribe((res: TimesheetSummaryModel[]) => {
                let ds = res.map((item, index) => ({ ...item, id: index + 1 }));
    
                this.timesheetSummaryService.getAllemployeetDataaaa().subscribe((employeeRes: any) => {
                    const activeEmployees = employeeRes.filter((employee: any) => employee.is_active === true);
                    const summaryMap = new Map(ds.map((summary: any) => [summary.user_id, summary]));
    
                    const combinedDs = activeEmployees.map((employee: any, index: number) => {
                        const existingSummary = summaryMap.get(employee.id);
                        return {
                            Code: employee.employee_code,
                            Date: filterYear,
                            Department: employee.department,
                            Employee: employee.first_name + ' ' + employee.last_name,
                            Hours: existingSummary ? existingSummary.Hours : 0,
                            LVE: existingSummary ? existingSummary.LVE : 0,
                            ND: existingSummary ? existingSummary.ND : 0,
                            OT: existingSummary ? existingSummary.OT : 0,
                            RD: existingSummary ? existingSummary.RD : 0,
                            RG: existingSummary ? existingSummary.RG : 0,
                            RH: existingSummary ? existingSummary.RH : 0,
                            RHRD: existingSummary ? existingSummary.RHRD : 0,
                            SH: existingSummary ? existingSummary.SH : 0,
                            SHRD: existingSummary ? existingSummary.SHRD : 0,
                            Week_no: weekFilterValue,
                            id: index + 1,
                            user_id: employee.id
                        };
                    });
    
                    combinedDs.sort((a: { Employee?: string }, b: { Employee?: string }) => {
                        const lastNameA = (a.Employee?.split(' ').pop() || '').toLowerCase();
                        const lastNameB = (b.Employee?.split(' ').pop() || '').toLowerCase();
                        return lastNameA.localeCompare(lastNameB);
                    });
    
                    this.dataSource.data = combinedDs;
                    console.log('Sorted combined dataset:', combinedDs);
                });
            });
    
            console.log("Week filter applied:", weekFilterValue);
            console.log(this.dataSource.data);
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
            console.log("a", this.latestWeekNumber);
    
            this.timesheetSummaryService.getFilteringYearAndWeek(filterWeek, yearFilterValue).subscribe((res: TimesheetSummaryModel[]) => {
                let ds = res.map((item, index) => ({ ...item, id: index + 1 }));
    
                this.timesheetSummaryService.getAllemployeetDataaaa().subscribe((employeeRes: any) => {
                    const activeEmployees = employeeRes.filter((employee: any) => employee.is_active === true);
                    const summaryMap = new Map(ds.map((summary: any) => [summary.user_id, summary]));
    
                    const combinedDs = activeEmployees.map((employee: any, index: number) => {
                        const existingSummary = summaryMap.get(employee.id);
                        return {
                            Code: employee.employee_code,
                            Date: yearFilterValue,
                            Department: employee.department,
                            Employee: employee.first_name + ' ' + employee.last_name,
                            Hours: existingSummary ? existingSummary.Hours : 0,
                            LVE: existingSummary ? existingSummary.LVE : 0,
                            ND: existingSummary ? existingSummary.ND : 0,
                            OT: existingSummary ? existingSummary.OT : 0,
                            RD: existingSummary ? existingSummary.RD : 0,
                            RG: existingSummary ? existingSummary.RG : 0,
                            RH: existingSummary ? existingSummary.RH : 0,
                            RHRD: existingSummary ? existingSummary.RHRD : 0,
                            SH: existingSummary ? existingSummary.SH : 0,
                            SHRD: existingSummary ? existingSummary.SHRD : 0,
                            Week_no: filterWeek,
                            id: index + 1,
                            user_id: employee.id
                        };
                    });
    
                    combinedDs.sort((a: { Employee?: string }, b: { Employee?: string }) => {
                        const lastNameA = (a.Employee?.split(' ').pop() || '').toLowerCase();
                        const lastNameB = (b.Employee?.split(' ').pop() || '').toLowerCase();
                        return lastNameA.localeCompare(lastNameB);
                    });
    
                    this.dataSource.data = combinedDs;
                    console.log('Sorted combined dataset:', combinedDs);
                });
    
                this.filterYear = yearFilterValue;
                console.log("Year filter applied:", yearFilterValue);
                console.log(this.dataSource.data);
            });
        }
    
        console.log("End of selectYearNumber method.");
    }
    
    


    copyClipboard() {
        const data = this.dataSource.data;
        const rows = data
            .map(
                (item, index) =>
                    `${index + 1}\t${item.Department}\t${item.Employee}\t${item.Code}\t${item.RG}\t${item.OT}\t${item.RD}\t${item.RH}\t${item.SH}\t${item.RHRD}\t${item.SHRD}\t${item.LVE}\t${item.ND}\t${item.Hours}`,
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
