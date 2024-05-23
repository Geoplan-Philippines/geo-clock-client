import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, Validators } from "@angular/forms";
import { TimesheetUserService } from "./_service/timesheet-user.service";
import { EntryModel } from "../models/entry.model";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: "app-timesheet-user",
    templateUrl: "./timesheet-user.component.html",
    styleUrls: ["./timesheet-user.component.scss"],
})
export class TimesheetUserComponent {
    timesheetEntry: any[] = [];
    constructor(private TimesheetUserService: TimesheetUserService) {}

    dataSource = new MatTableDataSource<EntryModel>();
    dateFromDatabase: string = "";
    dynamicHeaderName: string[] = [];
    displayedColumns: string[] = ["project_name", "day_1", "day_2", "day_3", "day_4", "day_5", "day_6", "day_7"];

    ngOnInit() {
        this.dynamicTableHeader("Sun Mar 10 2024", "Sat Mar 16 2024");
        this.loadTimesheet();
    }

    loadTimesheet() {
        this.TimesheetUserService.getEntryTimesheetData().subscribe((res: any) => {
            const ds = res.data;
            // const duration = res.data[].date;
            // const user = res.data;
            this.timesheetEntry = ds;
            this.dataSource = new MatTableDataSource<EntryModel>(this.timesheetEntry);
        });
    }

    dynamicTableHeader(start_date: any, end_date: any) {
        const convertedStartDate = new Date(start_date);
        const convertedEndDate = new Date(end_date);

        this.dynamicHeaderName = [];

        while (convertedStartDate <= convertedEndDate) {
            const formattedDate = this.formatDate(convertedStartDate);
            this.dynamicHeaderName.push(formattedDate);
            convertedStartDate.setDate(convertedStartDate.getDate() + 1);
        }
        // console.log(this.dynamicHeaderName[0]);
    }

    formatDate(date: any) {
        console.log(date);
        const options = { weekday: "short", month: "long", day: "numeric" };
        const formattedDate = date.toLocaleDateString("en-US", options);

        return formattedDate.toString();
    }

    range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });

    // Call this function when a start date is selected
    onStartDateChange(event: { value: Date }): void {
        const startDate: Date = event.value;
        if (startDate) {
            // Automatically set the end date to 5 days after the start date
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6); // Add 5 days to the start date
            this.range.get("end")?.setValue(endDate);
            // const n  ewdate = startDate;
            console.log(endDate);
            this.dynamicTableHeader(startDate, endDate);
        }
    }

    timeForm = new FormGroup({
        hours: new FormControl("", [Validators.required, Validators.min(0), Validators.max(23)]),
        minutes: new FormControl("", [Validators.required, Validators.min(0), Validators.max(59)]),
    });

    onSubmit() {
        console.log(this.timeForm.value);
    }

    check(id: any) {
        console.log("id");
        console.log(id);
    }
}

// user input: 1.5
// [1, 5]
// 1. make the column name input in html
// 1.1 if the user input have 3 decimal e.g 1.2.4 empty the input (do not run event listener)
// 2. create event listener (keydown.enter)
// 3. save the user input on a variable
// 4. if user_input icludes "." split the number set the argument to "."
// 5. set the 2nd index to a variable name user_decimal
// 5.1 set the max variable to 60
// 6 multiply the user_decimal to the max variable
// 6.1 insert decimal in last 2 number e.g the quotient of 30 x 60 is 3000 the decimal would place here 30.00
// 6.2 convert 30.00 to 30
// 7. concatinate the 1st index, ":" and the converted value
// 8. the user_input will be 01:30
// 9. create a patch request to update the timesheet entry

// somehow glossary
// concatinate = split[0] + ":" + coverted_value
