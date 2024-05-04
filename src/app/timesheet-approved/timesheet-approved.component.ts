import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { TimesheetApprovedService } from "./_service/timesheet-approved.service";
import { TimesheetApprovedModel } from "../models/timesheet-approved.model";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { SummaryComponent } from "./_components/summary/summary.component";
import { weekNumber } from "weeknumber";
import { TimesheetService } from "../timesheet/_service/timesheet.service";

@Component({
    selector: "app-timesheet-approved",
    templateUrl: "./timesheet-approved.component.html",
    styleUrls: ["./timesheet-approved.component.scss"],
})
export class TimesheetApprovedComponent {

    [x: string]: any;
    employeeEntry: any[] = [];
    weekNumber: any[] = [];

    selectedEmployee: any = "";
    selectedWeek: any = "";
    dataSource = new MatTableDataSource<TimesheetApprovedModel>();
    filteredDataSource!: MatTableDataSource<TimesheetApprovedModel>; // Define filtered data source

    constructor(
        private timesheetService: TimesheetService,
        private TimesheetApprovedService: TimesheetApprovedService,
        public dialog: MatDialog,
    ) {}

    openDialog(approvedId: number, weekNo: number, userId: number, startDate: Date, endDate: Date) {
        const dialogRef = this.dialog.open(SummaryComponent, {
            data:{
                id: approvedId,
                week_number: weekNo,
                user_id: userId,
                start_date: startDate,
                end_date: endDate
            }
        });


        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log(`Dialog result: ${result}`);
            this.ngOnInit();
        });


        const dataEntry = {
            id: approvedId,
            week_number: weekNo,
            user_id: userId,
            start_date: startDate,
            end_date: endDate
        }

        console.log(dataEntry);
    }

    // Function to calculate the day of the year
    ngOnInit() {
        // this.loadTimesheet();
        // this.loadWeekNumbers();
        this.loadTImesheetApproved();
    }
    // loadTimesheet() {
    //     this.TimesheetApprovedService.getAllTimesheetData().subscribe((res: any) => {
    //         const ds = res.data;
    //         this.employeeEntry = ds;
    //         // this.dataSource = new MatTableDataSource<TimesheetApprovedModel>(ds);
    //         this.filteredDataSource = new MatTableDataSource<TimesheetApprovedModel>(ds); // Initialize filtered data source
    //     });
    // }
    calculateDayOfYear(startDate: string): number {
        const startDateObject = new Date(startDate);
        // console.log(weekNumber(startDateObject))
        return weekNumber(startDateObject);
    }
    // loadWeekNumbers() {
    //     this.TimesheetApprovedService.WeekNumberService().subscribe((res: any) => {
    //         const ds = res.data;
    //         this.weekNumber = ds;
    //         // this.dataSource = new MatTableDataSource<TimesheetApprovedModel>(ds);
    //     });
    // }

    displayedColumns: any[] = ["week_no", "employee", "approved", "start_date", "end_date"];

    loadTImesheetApproved() {
        const userId = Number(localStorage.getItem('id'));
    
        // Load user's department
        this.TimesheetApprovedService.getAllemployeetData().subscribe((employeeData: any) => {
            const user = employeeData.find((emp: any) => emp.id === userId);
            if (user) {
                const userDepartment = user.department;
                const isOwner = user.department === 'owner'; // Assuming 'owner' is the role for owners
    
                // Load all timesheet data
                this.TimesheetApprovedService.getAllTimesheetApprovedData().subscribe((timesheetData: any) => {
                    if (isOwner) {
                        // If user is an owner, display all timesheets
                        this.dataSource = new MatTableDataSource<TimesheetApprovedModel>(timesheetData);
                    } else {
                        // Filter timesheets based on user's department
                        const filteredTimesheets = timesheetData.filter((timesheet: any) => timesheet.user.department === userDepartment);
                        this.dataSource = new MatTableDataSource<TimesheetApprovedModel>(filteredTimesheets);
                    }
                });
            } else {
                console.log("User not found in the employee data.");
            }
        });
    }
    



    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    }
    eventSelection(event: Event) {
        this.selectedEmployee = event;
        this.filteredDataSource.filter = this.selectedEmployee.trim().toLowerCase();
    }
    // eventSelectionWeekly(event: Event) {
    //     this.selectedWeek = event;
    //     this.dataSource.filter = this.selectedWeek.trim().toLowerCase();
    // }
    eventSelectionWeeklyAPI(selectedWeek: number) {
        // Apply filtering to update filtered data source
        this.filteredDataSource.data = this.employeeEntry.filter(
            (entry) => this.calculateDayOfYear(entry.start_date) === selectedWeek,
        );
    }
}
