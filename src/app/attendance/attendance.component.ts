import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import { interval, Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { AttedanceModel } from "../models/attedance.model";
import { AttendanceService } from "./_service/attendance.service";
import { EncryptionService } from "../authentication/_guards/encrpytion.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import * as moment from "moment-timezone";
import { AttendanceTypeComponent } from "./_components/attendance-type/attendance-type.component";
import { TimeInValidationComponent } from "./_components/time-in-validation/time-in-validation.component";
import { SnackBarService } from "../shared/service/snack-bar/snack-bar.service";
import { TimeOutValidationComponent } from "./_components/time-out-validation/time-out-validation.component";
import { MatSelectChange } from "@angular/material/select";
import { MatPaginator } from "@angular/material/paginator";
import { ForMatDialogComponent } from "./_components/for-mat-dialog/for-mat-dialog.component";


@Component({
    selector: "app-attendance",
    templateUrl: "./attendance.component.html",
    styleUrls: ["./attendance.component.scss"],
})
export class AttendanceComponent{
    //         date: date,
    //         attendance_type: type,
    //         time_in: dateTime,
    //         time_in_location: data.display_name,
    //     },
    // });
    // return timeInValidate.afterClosed().subscribe(() => {
    //     this.loadAttendance();
    // });
    selectShift($event: MatSelectChange) {
        //         user_id: user,
        throw new Error("Method not implemented.");
    }
    currentTime: string = "";
    currentDate: string = "";

    allShiftTIme: string[] = []; // Array to store shift types
    shiftTime: string | null = null; // Variable to bind selected shift type

    private timerSubscription: Subscription | undefined;

    dataSource = new MatTableDataSource<AttedanceModel>();
    displayedColumns: string[] = [
        "shift",
        "type",
        "employee_name",
        "date",
        "time_in",
        "time_in_location",
        "time_out",
        "time_out_location",
        "total_hours",
        "status",
        "remarks",
    ];

    generalFilter: string = "";
    filterDate: string = "";

    filterData: any;
    todayDate: Date = new Date();

    timeInCon = false ;  
    fieldInCon = false ;  

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
    constructor(
        private datePipe: DatePipe,
        private _snackBarService: SnackBarService,
        private attendanceService: AttendanceService,
        private encrypt: EncryptionService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.updateTimeAndDate();
        // Update time and date every second
        this.timerSubscription = interval(1000).subscribe(() => {
            this.updateTimeAndDate();
        });

        this.loadAttendance();
        this.getShiftTimeInType();
    }
    // Clock time and date start
    ngOnDestroy(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }


    private updateTimeAndDate(): void {
        const now = new Date();
        this.currentTime = this.datePipe.transform(now, "mediumTime")!;
        this.currentDate = this.datePipe.transform(now, "mediumDate")!;
    }
    // Clock time and date end

    // time in click start

    getShiftTimeInType() {
        this.attendanceService.getAllDataDiff().subscribe(
            (res: any[]) => {
                // Use any[] if you don't have a model
                // Extract unique shift types
                this.allShiftTIme = [...new Set(res.map((item) => item.diff_name))];
            },
            (error) => {
                console.error("Error fetching shift data:", error);
            },
        );
    }

    initialTimeIn() {
        const currentDateTime = moment().tz("Asia/Manila");
        const date = currentDateTime.format("YYYY-MM-DD");
        const time = currentDateTime.format("HH:mm:ss.sss");
        const dateTime = `${date}T${time}Z`;

        const user = this.encrypt.getItem("id");
        console.log(user);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log(`longtitude ${longitude}, latitude ${latitude}`);
                const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

                fetch(nominatimUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Reverse Geocoding Result:", data.display_name);

                        const dataAttendance = {
                            user_id: user,
                            date: date,
                            statuses: "Initial",
                            time_in: dateTime,
                            time_in_location: data.display_name,
                        };
                        console.log(data);
                        this.attendanceService.postAllDataInitialTimeIn(dataAttendance).subscribe({
                            next: (response: any) => {
                                this._snackBarService.openSnackBar("Time In Successfully", "okay");
                                this.loadAttendance();
                            },
                            error: (error: any) => {
                                this._snackBarService.openSnackBar("Error", "okay");
                            },
                        });
                        // }
                    })

                    .catch((error) => {
                        console.error("Error fetching geocoding data:", error);
                    });
            },
            (error) => {
                console.error("Error getting location", error);
            },

            {
                enableHighAccuracy: true, // Request high accuracy
                timeout: 40000, // Timeout after 10 seconds
                maximumAge: 0, // Do not use a cached position
            },
        );
    }

    subsequentTimeIn() {
        const currentDateTime = moment().tz("Asia/Manila");
        const date = currentDateTime.format("YYYY-MM-DD");
        const time = currentDateTime.format("HH:mm:ss.sss");
        const dateTime = `${date}T${time}Z`;

        const user = this.encrypt.getItem("id");
        console.log(user);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log(`longtitude ${longitude}, latitude ${latitude}`);
                const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

                fetch(nominatimUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Reverse Geocoding Result:", data.display_name);

                        const dataAttendance = {
                            user_id: user,
                            date: date,
                            statuses: "Field",
                            time_in: dateTime,
                            time_in_location: data.display_name,
                        };
                        console.log(data);
                        this.attendanceService.postAllDataTimeIn(dataAttendance).subscribe({
                            next: (response: any) => {
                                this._snackBarService.openSnackBar("Time In Successfully", "okay");
                                this.loadAttendance();
                            },
                            error: (error: any) => {
                                this._snackBarService.openSnackBar("Error", "okay");
                            },
                        });
                    })

                    .catch((error) => {
                        console.error("Error fetching geocoding data:", error);
                    });
            },
            (error) => {
                console.error("Error getting location", error);
            },

            {
                enableHighAccuracy: true, // Request high accuracy
                timeout: 40000, // Timeout after 10 seconds
                maximumAge: 0, // Do not use a cached position
            },
        );
    }

    formatDateToString(currentDateTime: Date): string {
        const dateString = this.datePipe.transform(currentDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", "Asia/Manila");
        return dateString || "";
    }
    // time in click end

    InitialTimeOut() {
        const currentDateTime = moment().tz("Asia/Manila");
        const statuses = "Initial";
        const date = currentDateTime.format("YYYY-MM-DD");
        const user = this.encrypt.getItem("id");

        const formattedDateTime = moment(currentDateTime).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

                fetch(nominatimUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        // console.log('Reverse Geocoding Result:', data.display_name);
                        const location = data.display_name;
                        const dataAttendance = {
                            time_out: formattedDateTime,
                            time_out_location: location,
                        };
                        // console.log(data);

                        this.attendanceService.updateAllDataInitialTimeOut(user, date, statuses, dataAttendance).subscribe({
                            next: (response: any) => {
                                this._snackBarService.openSnackBar("Time out Successfully", "okay");
                                this.loadAttendance();
                            },
                            error: (error: any) => {
                                // Log the error to the console for debugging purposes
                                this._snackBarService.openSnackBar("Error", "okay");
                                console.error("Error from server:", error);
                            },
                        });
                    })

                    .catch((error) => {
                        console.error("Error fetching geocoding data:", error);
                    });
            },
            (error) => {
                console.error("Error getting location", error);
            },
            {
                enableHighAccuracy: true, // Request high accuracy
                timeout: 10000, // Timeout after 10 seconds
                maximumAge: 0, // Do not use a cached position
            },
        );
    }

    subsequentTimeOut() {
        const currentDateTime = moment().tz("Asia/Manila");
        const statuses = "Field";
        const date = currentDateTime.format("YYYY-MM-DD");
        const user = this.encrypt.getItem("id");

        const formattedDateTime = moment(currentDateTime).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

                fetch(nominatimUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        // console.log('Reverse Geocoding Result:', data.display_name);
                        const location = data.display_name;
                        const dataAttendance = {
                            time_out: formattedDateTime,
                            time_out_location: location,
                        };
                        // console.log(data);

                        this.attendanceService.updateAllDataInitialTimeOut(user, date, statuses, dataAttendance).subscribe({
                            next: (response: any) => {
                                this._snackBarService.openSnackBar("Time Out Successfully", "okay");
                                this.loadAttendance();
                            },
                            error: (error: any) => {
                                // Log the error to the console for debugging purposes
                                this._snackBarService.openSnackBar("Error", "okay");
                                console.error("Error from server:", error);
                            },
                        });
                    })

                    .catch((error) => {
                        console.error("Error fetching geocoding data:", error);
                    });
            },
            (error) => {
                console.error("Error getting location", error);
            },
            {
                enableHighAccuracy: true, // Request high accuracy
                timeout: 10000, // Timeout after 10 seconds
                maximumAge: 0, // Do not use a cached position
            },
        );
    }

    timeOutTypeChange(data: any, date: any) {
        const descriptionDialog = this.dialog.open(AttendanceTypeComponent, {
            data: {
                date: date,
                time_out: data.time_out,
                time_out_location: data.time_out_location,
                total_hours: data.total_hours,
            },
        });
        return descriptionDialog.afterClosed().subscribe(() => {
            this.loadAttendance();
        });
    }
    updatetimeOut(data: any, date: any, type: string) {
        const descriptionDialog = this.dialog.open(TimeOutValidationComponent, {
            data: {
                date: date,
                attendance_type: type,
                time_out: data.time_out,
                time_out_location: data.time_out_location,
                total_hours: data.total_hours,
            },
        });

        return descriptionDialog.afterClosed().subscribe(() => {
            this.loadAttendance();
        });
    }
    //time out click end

    // history table start
    loadAttendance() {
        const userId = Number(this.encrypt.getItem("id"));
        const currentDateTime = moment().tz("Asia/Manila");
        const date = currentDateTime.format("YYYY-MM-DD");
        // Load user's department
        this.attendanceService.getAllemployeetData().subscribe((employeeData: any) => {
            const currentUser = employeeData.find((emp: any) => emp.id === userId);
            console.log(currentUser)
            if (currentUser) {
                const userRole = currentUser.role;
                const userDepartment = currentUser.department;
                const isOwner = userRole === "superAdmin";

                this.attendanceService.getAllAttendanceData(date).subscribe((res: any) => {
                    const ds = res;

                    const timeInGetCon = ds.find((GettimeInCon: any) => GettimeInCon.time_out === '1970-01-01T00:00:00.000Z' && GettimeInCon.user_id === userId && GettimeInCon.statuses === 'Initial')
                    const fieldInGetCon = ds.find((GetFieldInCon: any) => GetFieldInCon.time_out === '1970-01-01T00:00:00.000Z' && GetFieldInCon.user_id === userId && GetFieldInCon.statuses === 'Field')

                    if(timeInGetCon){
                        this.timeInCon = true
                    }else{
                        this.timeInCon = false
                    }
                    if(fieldInGetCon){
                        this.fieldInCon = true
                    }
                    else{
                        this.fieldInCon = false
                    }

                    if (isOwner) {
                        this.dataSource = new MatTableDataSource<AttedanceModel>(ds);

                        ds.map((item: any, index: number) => ({ ...item, id: index + 1 }));
                        const filteredData = ds.filter((data: any) => {
                            const matchesGeneralFilter = this.generalFilter
                                ? JSON.stringify(data).toLowerCase().includes(this.generalFilter)
                                : true;
                            return matchesGeneralFilter;
                        });
                        this.dataSource.data = filteredData;
                        this.dataSource.paginator = this.paginator;

                        const firstdate = new Date();
                        const dateString = this.datePipe.transform(firstdate, "yyyy-MM-dd", "Asia/Manila");

                        const findTimeIn = ds.find(
                            (attendanceData: any) => attendanceData.date === dateString && attendanceData.user.id === userId,
                        );

                        this.filterData = findTimeIn ? findTimeIn.time_in : null;
                    } else {
                        // Filter timesheets based on user's department
                        let filteredattendance;

                        if (userRole === "admin") {
                            filteredattendance = ds.filter((timesheet: any) => timesheet.user.department === userDepartment);
                        } else if (userRole === "user") {
                            filteredattendance = ds.filter((timesheet: any) => timesheet.user.id === userId);
                        }

                        const updatedFilteredAttedance = filteredattendance.map((item: any, index: number) => ({
                            ...item,
                            id: index + 1,
                        }));
                        const filteredData = updatedFilteredAttedance.filter((data: any) => {
                            const matchesGeneralFilter = this.generalFilter
                                ? JSON.stringify(data).toLowerCase().includes(this.generalFilter)
                                : true;
                            return matchesGeneralFilter;
                        });

                        this.dataSource.data = filteredData;
                        this.dataSource.paginator = this.paginator;
                    }
                });
            }
        });
    }

    // history table end

    //  search bar start
    applyFilter(event: any) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.generalFilter = filterValue;
        if (this.filterDate === "") {
            this.loadAttendance();
        } else {
            this.loadFilteringWithDate();
        }
    }

    selectDate(event: any) {
        if (event === null) {
            this.loadAttendance();
        } else {
            const yearFilterValue = this.datePipe.transform(event, "yyyy-MM-dd");
            this.filterDate = yearFilterValue as string;
            this.loadFilteringWithDate();
        }
        console.log("Date selected:", this.filterDate);
    }

    loadFilteringWithDate() {
            const userId = Number(this.encrypt.getItem("id"));

            this.attendanceService.getAllemployeetData().subscribe((employeeData: any) => {
                const currentUser = employeeData.find((emp: any) => emp.id === userId);
    
                if (currentUser) {
                    const userRole = currentUser.role;
                    const userDepartment = currentUser.department;
                    const isOwner = userRole === "superAdmin";
    
                    this.attendanceService.getAllAttendanceData(this.filterDate).subscribe((res: any) => {
                        const ds = res;
    
                        if (isOwner) {
                            this.dataSource = new MatTableDataSource<AttedanceModel>(ds);
    
                            ds.map((item: any, index: number) => ({ ...item, id: index + 1 }));
                            const filteredData = ds.filter((data: any) => {
                                const matchesGeneralFilter = this.generalFilter
                                    ? JSON.stringify(data).toLowerCase().includes(this.generalFilter)
                                    : true;
                                return matchesGeneralFilter;
                            });
                            this.dataSource.data = filteredData;
                            this.dataSource.paginator = this.paginator;
    
                            const firstdate = new Date();
                            const dateString = this.datePipe.transform(firstdate, "yyyy-MM-dd", "Asia/Manila");
    
                            const findTimeIn = ds.find(
                                (attendanceData: any) => attendanceData.date === dateString && attendanceData.user.id === userId,
                            );
    
                            this.filterData = findTimeIn ? findTimeIn.time_in : null;
                        } else {
                            // Filter timesheets based on user's department
                            let filteredattendance;
    
                            if (userRole === "admin") {
                                filteredattendance = ds.filter((timesheet: any) => timesheet.user.department === userDepartment);
                            } else if (userRole === "user") {
                                filteredattendance = ds.filter((timesheet: any) => timesheet.user.id === userId);
                            }
    
                            const updatedFilteredAttedance = filteredattendance.map((item: any, index: number) => ({
                                ...item,
                                id: index + 1,
                            }));
                            const filteredData = updatedFilteredAttedance.filter((data: any) => {
                                const matchesGeneralFilter = this.generalFilter
                                    ? JSON.stringify(data).toLowerCase().includes(this.generalFilter)
                                    : true;
                                return matchesGeneralFilter;
                            });
    
                            this.dataSource.data = filteredData;
                            this.dataSource.paginator = this.paginator;
                        }
                    });
                }
            });
    }

    openDialog(): void { 
        this.dialog.open(ForMatDialogComponent, {
            width: '500px',
            height: '400px',
            data: {}
        })
        }
    // //  search bar end
    // ngAfterViewInit() {
    //     this.dataSource.paginator = this.paginator;
    // }

}
