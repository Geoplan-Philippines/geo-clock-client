import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { TimesheetApprovedService } from "./_service/timesheet-approved.service";
import { TimesheetApprovedModel } from "../models/timesheet-approved.model";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { SummaryComponent } from "./_components/summary/summary.component";
import { weekNumber } from "weeknumber";
import { TimesheetService } from "../timesheet/_service/timesheet.service";
import { MatPaginator } from "@angular/material/paginator";

import { EncryptionService } from "../authentication/_guards/encrpytion.service";
@Component({
    selector: "app-timesheet-approved",
    templateUrl: "./timesheet-approved.component.html",
    styleUrls: ["./timesheet-approved.component.scss"],
})
export class TimesheetApprovedComponent {
    [x: string]: any;
    employeeEntry: any[] = [];
    weekNumber: any[] = [];
    yearNumber: any[] = [];

    filterYear: string = '';
    filterWeek: string = '';
    generalFilter: string = '';

    latestWeekNumber: string= '';
    latestYearNumber: string= '';

    selectedEmployee: any = "";
    selectedWeek: any = "";
    dataSource = new MatTableDataSource<TimesheetApprovedModel>();
    filteredDataSource!: MatTableDataSource<TimesheetApprovedModel>; // Define filtered data source
    displayedColumns: any[] = ["week_no", "employee", "approved", "start_date", "end_date"];

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    constructor(
        private timesheetService: TimesheetService,
        private TimesheetApprovedService: TimesheetApprovedService,
        public dialog: MatDialog,
        private encrypt: EncryptionService
    ) {}

    openDialog(approvedId: number, weekNo: number, userId: number, startDate: Date, endDate: Date) {
        const dialogRef = this.dialog.open(SummaryComponent, {
            data: {
                id: approvedId,
                week_number: weekNo,
                user_id: userId,
                start_date: startDate,
                end_date: endDate,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log(`Dialog result: ${result}`);

        if(this.filterWeek === null || this.filterYear === ''){
            this.ngOnInit();

        }else{
         this.applyCompositeFilter();
        }
        });

        const dataEntry = {
            id: approvedId,
            week_number: weekNo,
            user_id: userId,
            start_date: startDate,
            end_date: endDate,
        };

        console.log(dataEntry);
    }

    // Function to calculate the day of the year
    ngOnInit() {
        this.loadTimesheetApprovedYear();
        this.loadWeekNumbers();
        this.loadAllTimesheetApproved();

        const date = new Date();
        this.latestYearNumber = date.getFullYear().toString();
        this.latestWeekNumber = weekNumber(date).toString();
        // console.log(date)
        // console.log("qwe",this.latestWeekNumber)
        // console.log("rty", this.latestYearNumber)

        // this.applyCompositeFilter()
        
    }

    loadTimesheetApprovedYear(): void {
        this.TimesheetApprovedService.getAllTimesheetApprovedData().subscribe((res: TimesheetApprovedModel[]) => {
            const ds = res.map((item, index) => ({ ...item, id: index + 1 }));
            // this.dataSource.data = ds;
            
            this.yearNumber = [...new Set(ds.map((item) => new Date(item.start_date).getFullYear()))]; 
            
        });
    }

    // calculateDayOfYear(startDate: string): number {
    //     const startDateObject = new Date(startDate);
    //     // console.log(weekNumber(startDateObject))
    //     console.log(weekNumber(startDateObject))
    //     return weekNumber(startDateObject);
    // }
    
    loadWeekNumbers() {
        this.TimesheetApprovedService.WeekNumberService().subscribe((res: any) => {
            const ds = res.data;
            this.weekNumber = ds;
            this.dataSource = new MatTableDataSource<TimesheetApprovedModel>(ds);
        });
    }

    loadAllTimesheetApproved() {
        const userId = Number(this.encrypt.getItem("id"));
        
        // Load user's department
        this.TimesheetApprovedService.getAllemployeetData().subscribe((employeeData: any) => {
            const user = employeeData.find((emp: any) => emp.id === userId);
            if (user) {
                const userDepartment = user.department;
                const isOwner = user.department === "owner"; // Assuming 'owner' is the role for owners

                // Load all timesheet data
                this.TimesheetApprovedService.getAllTimesheetApprovedDataByYearandWeek(this.latestYearNumber, this.latestWeekNumber).subscribe((timesheetData: any) => {
                    
                    if (isOwner) {
                        // If user is an owner, display all timesheets
                        this.dataSource = new MatTableDataSource<TimesheetApprovedModel>(timesheetData);
                        this.dataSource.paginator = this.paginator;
                        console.log(timesheetData)

                        const ds = timesheetData.map((item: any, index: number) => ({ ...item, id: index + 1 }));
                        const filteredData = ds.filter((data: any) => {
                            const matchesGeneralFilter = this.generalFilter ? JSON.stringify(data).toLowerCase().includes(this.generalFilter) : true;
                            return  matchesGeneralFilter;
                        });
                        this.dataSource.data = filteredData;
                    } else {
                        // Filter timesheets based on user's department
                        const filteredTimesheets = timesheetData.filter(
                            (timesheet: any) => timesheet.user.department === userDepartment,
                        );
                        
                        console.log(filteredTimesheets)

                        this.dataSource = new MatTableDataSource<TimesheetApprovedModel>(filteredTimesheets);
                        this.dataSource.paginator = this.paginator;


                        const ds = filteredTimesheets.map((item: any, index: number) => ({ ...item, id: index + 1 }));
                        const filteredData = ds.filter((data: any) => {
                            const matchesGeneralFilter = this.generalFilter ? JSON.stringify(data).toLowerCase().includes(this.generalFilter) : true;
                            return  matchesGeneralFilter;
                        });
                        this.dataSource.data = filteredData;
                    }
                  
                    
                });
            } else {
                console.log("User not found in the employee data.");
            }
        });
    }

    applyFilter(event: any) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.generalFilter = filterValue; 
        // console.log(this.generalFilter)
        this.applyCompositeFilter();
        this.loadAllTimesheetApproved();
    }

    selectWeekNumber(event: any) {
        if (event === null) {
            this.loadAllTimesheetApproved();
          
        } else {
            const weekFilterValue = event.value;
            this.filterYear = this.latestYearNumber
            this.filterWeek = weekFilterValue;
            this.applyCompositeFilter();
        }
        console.log("Week selected:", this.filterWeek);
    }
    
    selectYearNumber(event: any) {
        if (event === null) {
            this.loadAllTimesheetApproved();
     
        } else {
            const yearFilterValue = event.value;
            this.filterWeek = this.latestYearNumber
            this.filterYear = yearFilterValue;
            this.applyCompositeFilter();
        }
        console.log("Year selected:", this.filterYear);
    }
    
    applyCompositeFilter() {
        if (!this.filterYear || !this.filterWeek) {
            // Either year or week filter is not set, do not apply filter
            return;
        }
        // console.log(this.filterWeek)
        // console.log(this.filterYear)
        const userId = Number(this.encrypt.getItem("id"));

        this.TimesheetApprovedService.getAllemployeetData().subscribe((employeeData: any) => {
            const user = employeeData.find((emp: any) => emp.id === userId);
            if (user) {
                const userDepartment = user.department;
                const isOwner = user.department === "owner"; // Assuming 'owner' is the role for owners

                // Load all timesheet data
                this.TimesheetApprovedService.getAllTimesheetApprovedDataByYearandWeek(this.filterYear, this.filterWeek).subscribe((timesheetData: any) => {
                    if (isOwner) {
                        // If user is an owner, display all timesheets
                        this.dataSource = new MatTableDataSource<TimesheetApprovedModel>(timesheetData);
                        this.dataSource.paginator = this.paginator;
                        console.log(timesheetData)

                       
                        
                        const ds = timesheetData.map((item: any, index: number) => ({ ...item, id: index + 1 }));
                        const filteredData = ds.filter((data: any) => {
                            const matchesGeneralFilter = this.generalFilter ? JSON.stringify(data).toLowerCase().includes(this.generalFilter) : true;
                            return  matchesGeneralFilter;
                        });
                        this.dataSource.data = filteredData;
                    } else {
                        // Filter timesheets based on user's department
                        const filteredTimesheets = timesheetData.filter(
                            (timesheet: any) => timesheet.user.department === userDepartment,
                        );
                        
                        console.log(filteredTimesheets)

                        this.dataSource = new MatTableDataSource<TimesheetApprovedModel>(filteredTimesheets);
                        this.dataSource.paginator = this.paginator;


                        const ds = filteredTimesheets.map((item: any, index: number) => ({ ...item, id: index + 1 }));
                        const filteredData = ds.filter((data: any) => {
                            const matchesGeneralFilter = this.generalFilter ? JSON.stringify(data).toLowerCase().includes(this.generalFilter) : true;
                            return  matchesGeneralFilter;
                        });
                        this.dataSource.data = filteredData;
                    }
                  
                    
                });
            } else {
                console.log("User not found in the employee data.");
            }
        });
    }
}
