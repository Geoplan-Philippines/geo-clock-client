// external dependencies
import * as XLSX from "xlsx";
import { weekNumber } from "weeknumber";

// internal dependencies
import { GENERAL } from "../shared/constants/general";

// angular dependencies
import { Component, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

// material ui dependencies
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";

// services
import { TimesheetService } from "./_service/timesheet.service";
import { SnackBarService } from "../shared/service/snack-bar/snack-bar.service";
import { DialogService } from "../shared/service/dialog/dialog.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DescriptionComponent } from "./_components/description/description.component";

// components
import { DeleteConfirmationModalComponent } from "./_components/delete-confirmation-modal/delete-confirmation-modal.component";

@Component({
    selector: "app-timesheet",
    templateUrl: "./timesheet.component.html",
    styleUrls: ["./timesheet.component.scss"],
})
export class TimesheetComponent {
    readonly GENERAL = GENERAL;
    user_id: number[] = [];
    dialogRef: any = MatDialogRef<any>;
    weekNumber: any[] = [];

    // material ui table variables
    columnCount: number = 0;
    displayedColumns: string[] = ["project_name", "day_0", "day_1", "day_2", "day_3", "day_4", "day_5", "day_6", "total"];
    dynamicHeaderName: string[] = [];
    dataSource = new MatTableDataSource<any>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    fileName = "ExcelSheet.xlsx";
    project: any[] = []; //dropdown filter
    projects: any[] = []; //for menu
    selectedProject: any = "";

    selectedStartDateYear: any = "";

    start_date_data: any = "";
    end_date_data: any = "";

    timesheet_entries: string = "";
    latest_start_date: string = "";

    dateFromFilter!: Date;

    hasValue(value: any): boolean {
        return value !== undefined && value !== null && value !== "";
    }

    constructor(
        private timesheetService: TimesheetService,
        private _snackBarService: SnackBarService,
        private datePipe: DatePipe,
        private dialogService: DialogService,
        private dialog: MatDialog,
        // private dialog: MatDialog,
    ) {}

    ngOnInit() {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 6);
        // Get the parts of the Date
        const day = today.toLocaleString("en-US", { weekday: "short" }); // Short weekday name (e.g., "Sun")
        const month = today.toLocaleString("en-US", { month: "short" }); // Short month name (e.g., "Mar")
        const date = today.getDate(); // Day of the month (e.g., 10)
        const year = today.getFullYear(); // Full year (e.g., 2024)

        const date_first = `${day} ${month} ${date} ${year} 00:00:00 GMT+0800 (Philippine Standard Time)`;

        this.latest_start_date = date_first;

        this.dynamicTableHeader(
            "Sun Mar 10 2024 00:00:00 GMT+0800 (Philippine Standard Time)",
            "Sat Mar 16 2024 00:00:00 GMT+0800 (Philippine Standard Time)",
        );
        // this.loadTimesheet();
        // console.log(localStorage.getItem("id"));
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),
            map((value) => this._filter(value || "")),
        );
        this.loadProjects();
    }

    // calculateDayOfYear(startDate: string): number {
    //     const startDateObject = new Date(startDate);
    //     return weekNumber(startDateObject);
    // }

    loadTimesheet() {
        const timesheetIdString = localStorage.getItem("id");
        if (timesheetIdString !== null) {
            const timesheetId = +timesheetIdString;
            this.timesheetService.getAllTimesheetData(timesheetId).subscribe((res: any) => {
                const ds = res;
                this.dataSource = new MatTableDataSource<any>(ds);
                this.dataSource.paginator = this.paginator;
                this.timesheet_entries = ds;
                console.log(ds);
                // console.log(this.dataSource);
            });
        } else {
            console.error("Timesheet ID is not available in localStorage");
        }
    }
    myControl = new FormControl("");
    filteredOptions!: Observable<string[]>;

    loadProjects() {
        this.timesheetService.getAllProjectData().subscribe((res: any) => {
            const ds = res.response;
            this.project = ds;
            this.projects = ds;
        });
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.projects.filter((project) => project.toLowerCase().includes(filterValue));
    }

    range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    filterDate(event: any) {
        const startDate = this.range.value.start;
        const endDate = this.range.value.end;

        if (startDate && endDate) {
            this.dataSource.filterPredicate = (data, filter) => {
                const dateCreated = new Date(data.date_created);
                const formattedStartDate = new Date(startDate);
                const formattedEndDate = new Date(endDate);
                formattedStartDate.setHours(0, 0, 0, 0);
                formattedEndDate.setHours(23, 59, 59, 999);

                return formattedStartDate <= dateCreated && dateCreated <= formattedEndDate;
            };
            this.dataSource.filter = "custom-filter"; // Set a dummy filter to trigger the update
        }
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

        // console.log(this.dynamicHeaderName);
    }

    formatDate(date: any) {
        const options = { weekday: "short", month: "short", day: "numeric" };
        const formattedDate = date.toLocaleDateString("en-US", options);
        return formattedDate.toString();
    }

    onlySundayFilter = (d: Date | null): boolean => {
        const day = (d || new Date()).getDay();
        return day === 0; // 0 is Sunday
    };

    myFilter = (d: Date | null): boolean => {
        const day = (d || new Date()).getDay();
        return day === 1;
    };

    onStartDateChange(event: { value: Date }): void {
        const startDate: Date = event.value;
        this.dateFromFilter = startDate;
        console.log(this.dateFromFilter);
        if (startDate) {
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6); // Add 5 days to the start date
            this.range.get("end")?.setValue(endDate);

            const formattedStartDate = this.datePipe.transform(startDate, "yyyy-MM-dd", "GMT+8", "en");
            const formattedEndDate = this.datePipe.transform(endDate, "yyyy-MM-dd", "GMT+8", "en");

            this.selectedStartDateYear = this.datePipe.transform(startDate, "yyyy", "GMT+8", "en");

            this.loadFilterTimesheet(formattedStartDate, formattedEndDate);
            this.dynamicTableHeader(startDate, endDate);
        }
    }
    loadFilterTimesheet(startDate: any, endDate: any) {
        const timesheetIdString = localStorage.getItem("id");

        this.start_date_data = startDate;

        if (timesheetIdString !== null) {
            const timesheetId = +timesheetIdString;
            this.timesheetService.getalltimesheetbydate(timesheetId, startDate, endDate).subscribe((res: any) => {
                const ds = res;
                // console.log(ds[1].project[1].actual_hours[1]); // Log the response to inspect its structure

                this.dataSource = new MatTableDataSource<any>(ds);
            });
        } else {
            console.error("Timesheet ID is not available in localStorage");
        }
    }

    eventSelection(event: Event) {
        this.selectedProject = event;
        console.log(this.dataSource);
        this.dataSource.filter = this.selectedProject.trim().toLowerCase();
        console.log(this.selectedProject);
        // If you want to filter based on project name
        this.dataSource.filterPredicate = (data: any, filter: string) => {
            const projectName = data.project.project_name.toLowerCase();
            return projectName.includes(filter);
        };
    }

    addRow() {
        this.dataSource.data.unshift({
            project: {
                id: 1,
                project_name: "",
                timesheetEntries: [
                    {
                        actual_hours: 0,
                    },
                    {
                        actual_hours: 0,
                    },
                    {
                        actual_hours: 0,
                    },
                    {
                        actual_hours: 0,
                    },
                    {
                        actual_hours: 0,
                    },
                    {
                        actual_hours: 0,
                    },
                    {
                        actual_hours: 0,
                    },
                ],
            },
        });
        this.dataSource._updateChangeSubscription();
    }

    exportexcel(): void {
        // Fetch all data from the data source
        const allData = this.dataSource.filteredData.slice();

        // Extract project data to include only the project information
        const projectsData = allData.map((item) => item.project);

        // Extract all timesheet entries for each project
        const timesheetEntriesData = projectsData
            .map((project) => {
                return project.timesheetEntries.map((entry: { actual_hours: any }) => {
                    return {
                        project_name: project.project_name,
                        actual_hours: entry.actual_hours || 0, // Assuming actual_hours is the property you want to export
                        // Add more properties if needed
                    };
                });
            })
            .flat(); // Flatten the array of arrays

        // Create a new workbook
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // Convert timesheet entries data to a worksheet
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(timesheetEntriesData);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "TimesheetEntries");

        // Save the workbook to a file
        XLSX.writeFile(wb, this.fileName);
    }

    //renan pogi on process start
    postProjects(event: FocusEvent) {
        const projectNameValue = (event.target as HTMLInputElement).value;
        if (projectNameValue === "") {
            //kapag pareho ng projectname at date wag mo payagan mag lagay
            // console.log("pogi walang laman"); //snackbar jv
            this._snackBarService.openSnackBar("Creating Project Failed", "okay");
        } else {
            this.validateProjectInput(projectNameValue);
        }
    }
    validateProjectInput(projectNameValue: string) {
        this.timesheetService.getAllProjectData().subscribe((res: any) => {
            const existingProjects = res.response;
            const existingProject = existingProjects.find((project: any) => project.project_name === projectNameValue);
            if (existingProject) {
                console.log("go");
                this.timesheetService.getProjectName().subscribe((res: any) => {
                    const existingProjects = res;
                    const existingProject = existingProjects.find((project: any) => project.project_name === projectNameValue);

                    if (existingProject) {
                        console.log("Project already exists.");

                        const projectId = existingProject.id;
                        const projectName = existingProject.project_name;
                        // this.dataSource.data[currentIndex].project.id = projectId
                        // this.dataSource.data[currentIndex].project.project_name = projectName
                        const userId = Number(localStorage.getItem("id"));
                        // localStorage.setItem('projectId', projectId)
                        // console.log(this.dataSource.data[currentIndex])

                        this.postData(projectId, userId);
                    } else {
                        // Post the project name if it doesn't exist
                        this.timesheetService.postProjectName(projectNameValue).subscribe({
                            next: (response: any) => {
                                console.log("Successfully created:", response);

                                // Assuming project.id is available in the response
                                const projectId = response.id; // Make sure response contains the id
                                const userId = Number(localStorage.getItem("id"));
                                // localStorage.setItem('projectId', projectId)

                                this.postData(projectId, userId);
                            },
                            error: (error: any) => {
                                console.log("Error creating project:", error);
                            },
                        });
                    }
                });
            } else {
                console.log("bawal mema dito");
                this._snackBarService.openSnackBar("The project name is not whitelisted", "okay");
            }
        });
    }

    postData(projectId: number, userId: number) {
        const filteringDate = new Date(this.start_date_data);
        const latestDate = new Date(this.latest_start_date);

        let valueDate: any;
        let weekNum: any;

        if (filteringDate instanceof Date && !isNaN(filteringDate.getTime())) {
            valueDate = filteringDate;
            weekNum = weekNumber(filteringDate);
        } else if (latestDate instanceof Date && !isNaN(latestDate.getTime())) {
            const latestDateWithPHTime = this.datePipe.transform(latestDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", "Asia/Manila");
            valueDate = latestDateWithPHTime;
            weekNum = weekNumber(latestDate);
        } else {
            console.error("Both filteringDate and latestDate are not valid Date objects.");
        }

        const dataParams = {
            user_id: userId,
            project_id: projectId,
            date: valueDate,
            actual_hours: 0,
            is_ot: false,
            is_nd: false,
            approved_by: '',
            week_number: weekNum,
        };

        this.timesheetService.postProject(dataParams).subscribe({
            next: (response: any) => {
                console.log("Successfully created:", response);
                
                this.getTimesheetApproved(weekNum, valueDate);

                // this.loadTimesheetByDate(userId, valueDate);

                this._snackBarService.openSnackBar("Project name has been created", "okay");
                ///
                if (this.dateFromFilter !== undefined) {
                    // Variable is defined
                    this.onStartDateChange({ value: this.dateFromFilter }); // Adjusted call to pass the date object
                } else {
                    // Variable is undefined
                    const latestStartDate = new Date(this.latest_start_date);
                    this.onStartDateChange({ value: latestStartDate }); // Adjusted call to pass the date object
                }
            },
            error: (error) => {
                console.log("lagyan mo nang validation dito");
                if (this.dateFromFilter !== undefined) {
                    // Variable is defined
                    this.onStartDateChange({ value: this.dateFromFilter }); // Adjusted call to pass the date object
                } else {
                    // Variable is undefined
                    const latestStartDate = new Date(this.latest_start_date);
                    this.onStartDateChange({ value: latestStartDate }); // Adjusted call to pass the date object
                }
                this._snackBarService.openSnackBar("Project name exist", "okay");
            },
        });
    }

    // loadTimesheetByDate(userId: number, inputDate: Date) {
    //     this.timesheetService.getAlltimesheetDataByDate(userId, inputDate).subscribe((res: any) => {
    //         const ds = res;
    //         this.dataSource = new MatTableDataSource<any>(ds);
    //         this.dataSource.paginator = this.paginator;
    //         this.timesheet_entries = ds;
    //         console.log(ds);
    //     });
    // }

    //renan pogi on process end
    getHoursForDate(timesheetEntries: any[], index: any) {
        const entry = timesheetEntries.find((entry) => {
            const date = new Date(entry.date);
            return this.formatDate(date) === this.dynamicHeaderName[index];
        });
        return entry ? entry.actual_hours : 0;
    }

    getTotalHours(timesheetEntries: any[]): number {
        return timesheetEntries.reduce((total, entry) => total + entry.actual_hours, 0);
    }

    saveEntries(value: any, entryBy: number, timesheetEntries: any[], project_id: any, index: any, event: any) {
        console.log(event.type);
        if (event.key === "Enter" || event.type === "blur") {
            const entry = timesheetEntries.find((entry) => {
                const date = new Date(this.dynamicHeaderName[index]);
                return this.formatDate(date) === this.dynamicHeaderName[index];
            });
            const formattedDateToISO = new Date(this.dynamicHeaderName[index]);
            formattedDateToISO.setFullYear(this.selectedStartDateYear);
            const selectedDate = this.datePipe.transform(formattedDateToISO, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", "Asia/Manila");

            console.log(value);
            if (value <= 20) {
                const weekNum = weekNumber(formattedDateToISO);
                const postParams = {
                    date: selectedDate,
                    actual_hours: +value,
                    is_ot: false,
                    is_nd: false,
                    user_id: entryBy,
                    project_id: project_id,
                    week_number: weekNum,
                };
                const editParams = {
                    actual_hours: +value,
                };

                this.isHaveEntries(timesheetEntries, selectedDate, postParams, editParams);
            } else {
                if (this.dateFromFilter !== undefined) {
                    // Variable is defined
                    this.onStartDateChange({ value: this.dateFromFilter }); // Adjusted call to pass the date object
                } else {
                    // Variable is undefined
                    const latestStartDate = new Date(this.latest_start_date);
                    this.onStartDateChange({ value: latestStartDate }); // Adjusted call to pass the date object
                }
                this._snackBarService.openSnackBar("20 Hours is the limit entry", "okay");
            }
        }
    }

    postTimesheetEntry(params: any) {
        this.timesheetService.postTimesheetEntry(params).subscribe({
            next: (response) => {
                console.log("Entry successfully:", response);
                this._snackBarService.openSnackBar("Time entry has been created", "okay");

                console.log(params);

                const userId = params.user_id;
                const valueDate = params.date;

                // this.loadTimesheetByDate(userId, valueDate);
                // console.log(valueDate);
                const trimmedDate = this.formatDateRee(valueDate);
                console.log(trimmedDate); // Output: 2024-04-11
                this.onStartDateChange({ value: this.dateFromFilter }); // Adjusted call to pass the date object
                this.getTimesheetApproved(params.week_number, valueDate);
                
            },
            error: (error) => {
                console.error("Error creating entry:", error);
            },
        });
    }
    formatDateRee(dateString: string): Date {
        const date = new Date(dateString);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    editTimesheetEntry(id: any, params: any) {
        console.log("edited");
        this.timesheetService.editTimesheetEntry(id, params).subscribe({
            next: (response) => {
                console.log("Edit successfully:", response);
                this._snackBarService.openSnackBar("Succesfully updated 1 time entries", "okay");
                if (this.dateFromFilter !== undefined) {
                    // Variable is defined
                    this.onStartDateChange({ value: this.dateFromFilter }); // Adjusted call to pass the date object
                } else {
                    // Variable is undefined
                    const latestStartDate = new Date(this.latest_start_date);
                    this.onStartDateChange({ value: latestStartDate }); // Adjusted call to pass the date object
                    this._snackBarService.openSnackBar("Succesfully enter a task description", "okay");
                }
            },
            error: (error) => {
                console.error("Error creating entry:", error);
            },
        });
    }

    isHaveEntries(timesheetEntries: any[], date: any, postParams: any, editParams: any) {
        console.log(timesheetEntries);
        console.log(date);

        const matchingEntry = timesheetEntries.find((entry) => entry.date === date);

        if (matchingEntry) {
            if (editParams.actual_hours === 0) {
                console.log(matchingEntry.id);

                this.dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
                    data: {
                        id: matchingEntry.id,
                    },
                });
                this.dialogRef.afterClosed().subscribe((result: any) => {
                    if (this.dateFromFilter !== undefined) {
                        // Variable is defined
                        this.onStartDateChange({ value: this.dateFromFilter }); // Adjusted call to pass the date object
                        this._snackBarService.openSnackBar("Succesfully enter a task description", "okay");
                    } else {
                        // Variable is undefined
                        const latestStartDate = new Date(this.latest_start_date);
                        this.onStartDateChange({ value: latestStartDate }); // Adjusted call to pass the date object
                        this._snackBarService.openSnackBar("Succesfully enter a task description", "okay");
                    }
                    // this.loadTimesheet();
                });
            } else if (editParams.actual_hours === matchingEntry.actual_hours) {
                console.log("no edit changes");
            } else {
                this.editTimesheetEntry(matchingEntry.id, editParams);
            }
        } else {
            console.log(matchingEntry);
            if (postParams.actual_hours === 0) {
                console.log("no change");
            } else {
                this.postTimesheetEntry(postParams);
            }
        }
    }

    openTimesheetEntryDescription(date: any, timesheetEntries: any, index: any) {
        const formattedDateToISO = new Date(this.dynamicHeaderName[index]);
        formattedDateToISO.setFullYear(this.selectedStartDateYear);
        const transformDate = this.datePipe.transform(formattedDateToISO, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", "Asia/Manila");

        const matchEntry = timesheetEntries.find((entry: any) => entry.date == transformDate);

        console.log(date);
        this.dialogService.openTimesheetEntryDescription(matchEntry.id, matchEntry.description).subscribe((result) => {
            console.log(`Dialog result: ${result}`);
            if (this.dateFromFilter !== undefined) {
                // Variable is defined
                this.onStartDateChange({ value: this.dateFromFilter }); // Adjusted call to pass the date object
            } else {
                // Variable is undefined
                const latestStartDate = new Date(this.latest_start_date);
                this.onStartDateChange({ value: latestStartDate }); // Adjusted call to pass the date object
                this._snackBarService.openSnackBar("Succesfully enter a task description", "okay");
            }
        });
    }


    getTimesheetApproved(weekNo: number, date: any) {
        var dateinput = new Date(date);
        const year = dateinput.getFullYear();
        var weekNumber = weekNo;
        var startDate = new Date(year, 0, 1);
        var dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);
        startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);

        // Set time components of startDate to 00:00:00
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        // Set time components of endDate to 00:00:00
        endDate.setHours(0, 0, 0, 0);

        // Convert start date and end date to string representation in "YYYY-MM-DD" format
        const startDateString = startDate.toISOString().split('T')[0] + 'T00:00:00Z';
        const endDateString = endDate.toISOString().split('T')[0] + 'T00:00:00Z';

    
        const userId = Number(localStorage.getItem("id"));
    
        this.timesheetService.getAllTimesheetApprovedData().subscribe((res: any) => {
            const ds = res;
    
            const existingWeek = ds.find((week: any) => {
                const startDate = new Date(week.start_date);
                const yearPart = startDate.getFullYear();
                const weekNo = week.week_no;
                return yearPart === year && weekNo === weekNumber;
            });
    
            if (existingWeek) {
                console.log('exist na')
            } else {
                const ApprovedData = {
                    week_no: weekNumber,
                    user_id: userId,
                    approved: '',
                    start_date: startDateString,
                    end_date: endDateString,
                }
                this.postTimesheetApproved(ApprovedData);
            }
        });
    
        console.log(dateinput);
        console.log("Start date of week " + weekNumber + " of " + year + " is: " + startDate + " - End date: " + endDate);
    }
    
    

    postTimesheetApproved(approvedData: any){
        this.timesheetService.postAlltimesheetApproved(approvedData).subscribe({
            next: (response) => {
                console.log('successfully', response)
            },
            error: (error) => {
                console.error("Error creating approved:", error);
            },
        })           
    }
}
