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

    openDialog(weekNo: number, userId: number, startDate: Date, endDate: Date) {
        const dialogRef = this.dialog.open(SummaryComponent, {
            data:{
                week_number: weekNo,
                user_id: userId,
                start_date: startDate,
                end_date: endDate
            }
        });


        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log(`Dialog result: ${result}`);
        });


        const dataEntry = {
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

    loadTImesheetApproved(){
                this.timesheetService.getAllTimesheetApprovedData().subscribe((res:any) =>{
                    const ds = res;
                    this.dataSource = new MatTableDataSource<TimesheetApprovedModel>(ds);
                })
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
