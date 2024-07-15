import { Component, OnDestroy, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { interval, Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { AttedanceModel } from "../models/attedance.model";
import { AttendanceService } from "./_service/attendance.service";
import { EncryptionService } from "../authentication/_guards/encrpytion.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import * as moment from 'moment-timezone';
import { AttendanceTypeComponent } from "./_components/attendance-type/attendance-type.component";
import { TimeInValidationComponent } from "./_components/time-in-validation/time-in-validation.component";
import { SnackBarService } from "../shared/service/snack-bar/snack-bar.service";
import { TimeOutValidationComponent } from "./_components/time-out-validation/time-out-validation.component";

@Component({
    selector: "app-attendance",
    templateUrl: "./attendance.component.html",
    styleUrls: ["./attendance.component.scss"],
})
export class AttendanceComponent implements OnInit, OnDestroy {
    currentTime: string = "";
    currentDate: string = "";
    private timerSubscription: Subscription | undefined;

    dataSource = new MatTableDataSource<AttedanceModel>();
    displayedColumns: string[] = [
        "type",
        "employee_name",
        "date",
        "time_in",
        "time_in_location",
        "time_out",
        "time_out_location",
        "total_hours",
    ];

    generalFilter: string = "";
    filterDate: string = "";

    filterData: any;

    constructor(
        private datePipe: DatePipe,
        private _snackBarService: SnackBarService,
        private attendanceService: AttendanceService,
        private encrypt: EncryptionService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.updateTimeAndDate();
        // Update time and date every second
        this.timerSubscription = interval(1000).subscribe(() => {
            this.updateTimeAndDate();
        });

        this.loadAttendance();
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

    getShiftTimeInType(currentTime: Date): string {
        const hour = currentTime.getHours();
        if (hour >= 21 || hour < 6) {
          return "ND";
        } else if (hour >= 7 && hour < 21) {
          return "DW";
        } else {
          return "Undefined Shift";
        }
    }
        
    timeIn() {
        const currentDateTime = moment().tz("Asia/Manila");
        const date = currentDateTime.format("YYYY-MM-DD");
        const type = this.getShiftTimeInType(currentDateTime.toDate());
        const time = currentDateTime.format("HH:mm:ss.sss");
        const dateTime = `${date}T${time}Z`

        console.log({ date, type, dateTime });
        const user = this.encrypt.getItem("id");
        console.log(user);
      
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`longtitude ${longitude}, latitude ${latitude}`)
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
        

            fetch(nominatimUrl)
            .then(response => response.json())
            .then(data => {

                console.log('Reverse Geocoding Result:', data.display_name);

            
                const dateTimeValidation = `${date}T07:00:00.000Z`
                const dateValidationIn = moment(dateTimeValidation).set({ hour: 7, minute: 0, second: 0, millisecond: 0 }).format('MMMM D YYYY HH:mm A');

                if(type === "Undefined Shift"){
                    this._snackBarService.openSnackBar(`You can wait at ${dateValidationIn}`, "okay");
                }else{    
                    const dataAttendance = {
                        user_id: user,
                        date: date,
                        attendance_type: type,
                        time_in: dateTime,
                        time_in_location: data.display_name,
                    };
                    console.log(data);
                    this.attendanceService.postAllAttendanceData(dataAttendance).subscribe({
                    next: (response: any) => {
                        this._snackBarService.openSnackBar("Time In Successfully", "okay");
                        this.loadAttendance();
                    },
                    error: (error: any) => {
                        // console.error("Error creating entry:", error);
                       const timeInValidate = this.dialog.open(TimeInValidationComponent, {
                            data: {
                                user_id: user,
                                date: date,
                                attendance_type: type,
                                time_in: dateTime,
                                time_in_location: data.display_name,
                            },
                        });
                        return timeInValidate.afterClosed().subscribe(() => {
                            this.loadAttendance();
                          });
                    }
                    });
                }
            })
                    
            .catch(error => {
              console.error('Error fetching geocoding data:', error);
            }); 
     
          },
          (error) => {
            console.error('Error getting location', error);
          },

          {
            enableHighAccuracy: true, // Request high accuracy
            timeout: 40000, // Timeout after 10 seconds
            maximumAge: 0 // Do not use a cached position
        }
          
        );
      }
      formatDateToString(currentDateTime: Date): string {
        const dateString = this.datePipe.transform(currentDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", "Asia/Manila");
        return dateString || '';
      }
    // time in click end
    // time out click start
    getShiftTimeOutType(currentTime: Date): string {
        const hour = currentTime.getHours();
        if (hour >= 21 || hour < 6) {
            return "ND";
          } else if (hour >= 7 && hour < 21) {
            return "DW";
          } else {
            return "Undefined Shift";
          }
    }
     getShiftTimeOut(currentTime: Date): string {
            const currentMoment = moment(currentTime).tz("Asia/Manila");
            const hour = currentMoment.hour();
            const adjustedMoment = currentMoment.clone().add(8, 'hours');

            if (hour >= 22 || hour < 8) {
            // // Night shift
            // adjustedMoment.subtract(1, 'day');
            return adjustedMoment.toISOString();
            } else if (hour >= 8 && hour < 22) {
            // Day shift
            return adjustedMoment.toISOString();
            } else {
            return "Undefined Shift";
            }
        }

      timeOut() {
        const currentDateTime = moment().tz("Asia/Manila")
        const type = this.getShiftTimeOutType(moment(currentDateTime).toDate());
        const date = currentDateTime.format("YYYY-MM-DD");
        const user = this.encrypt.getItem("id");

        const time_out = this.getShiftTimeOut(moment(currentDateTime).toDate());
        const time_in_string = moment.utc(this.filterData).valueOf();
        const formattedTimeIn = moment.utc(time_in_string).format('YYYY-MM-DD HH:mm:ss');
        const formattedTimeOut = moment.utc(time_out).format('YYYY-MM-DD HH:mm:ss');

        const timeIn = moment.utc(formattedTimeIn, 'YYYY-MM-DD HH:mm:ss');
        const timeOut = moment.utc(formattedTimeOut, 'YYYY-MM-DD HH:mm:ss');
        // Calculate the difference in milliseconds
        const duration = moment.duration(timeOut.diff(timeIn));

        // Convert the duration to hours
        const totalHours = duration.asMinutes() < 60 ? 0 : Math.round(duration.asHours());
        console.log("totalhours",totalHours)

        

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

            fetch(nominatimUrl)
            .then(response => response.json())
            .then(data => {
                // console.log('Reverse Geocoding Result:', data.display_name);
                const location = data.display_name
                const dataAttendance = {
                    time_out: time_out,
                    time_out_location: location,
                };
                // console.log(data);


                this.attendanceService.updateAllAttendanceData(user, date, type, dataAttendance).subscribe({
                next: (response: any) => {
                    this._snackBarService.openSnackBar("Time Out Successfully", "okay");
                    this.loadAttendance();
                },
                error: (error: any) => {
                 
                      // Log the error to the console for debugging purposes
                    console.error('Error from server:', error);

                    // Extract error message from response
                    const errorMessage = error.error?.message || "Failed to time out. Please try again.";
        
                    if (errorMessage === 'Record already exists for the previous date with default time_out.') {
                    this._snackBarService.openSnackBar("Record already exists with default time_out.", "okay");
                    this.updatetimeOut(dataAttendance, date, type)

                    } else if (errorMessage === 'No attendance record found for the given user and dates.') {
                    this._snackBarService.openSnackBar("No record found for the given user and dates.", "okay");
                    this.timeOutTypeChange(dataAttendance, date)

                    } else {
                    this._snackBarService.openSnackBar(errorMessage, "okay");
                    }
                }
                });
                })

            .catch(error => {
              console.error('Error fetching geocoding data:', error);
            }); 
     
          },
          (error) => {
            console.error('Error getting location', error);
          },
          {
            enableHighAccuracy: true, // Request high accuracy
            timeout: 10000, // Timeout after 10 seconds
            maximumAge: 0 // Do not use a cached position
        }
        );
      }
    timeOutTypeChange(data: any, date: any){
        const descriptionDialog = this.dialog.open(AttendanceTypeComponent, {
            data: {
                date:date,
                time_out: data.time_out,
                time_out_location: data.time_out_location,
                total_hours: data.total_hours
            },
        });
       return descriptionDialog.afterClosed().subscribe(() => {
           this.loadAttendance();
          });
    } 
    updatetimeOut(data: any, date: any, type: string){
        const descriptionDialog = this.dialog.open(TimeOutValidationComponent, {
            data: {
                date:date,
                attendance_type: type,
                time_out: data.time_out,
                time_out_location: data.time_out_location,
                total_hours: data.total_hours
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
    
        // Load user's department
        this.attendanceService.getAllemployeetData().subscribe((employeeData: any) => {
            const currentUser = employeeData.find((emp: any) => emp.id === userId);
    
            if (currentUser) {
                const userRole = currentUser.role;
                const userDepartment = currentUser.department;
                const isOwner = userDepartment === "owner";
    
                this.attendanceService.getAllAttendanceData().subscribe((res: any) => {
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
    
                        const firstdate = new Date();
                        const dateString = this.datePipe.transform(firstdate, "yyyy-MM-dd", "Asia/Manila");
    
                        const findTimeIn = ds.find((attendanceData: any) =>
                            attendanceData.date === dateString && attendanceData.user.id === userId
                        );
    
                        this.filterData = findTimeIn ? findTimeIn.time_in : null;
    
                    } else {
                        // Filter timesheets based on user's department
                        let filteredattendance;

                        if (userRole === 'admin') {
                            filteredattendance = ds.filter(
                                (timesheet: any) => timesheet.user.department === userDepartment
                            );
                        } else if(userRole === 'user') {
                            filteredattendance = ds.filter(
                                (timesheet: any) => timesheet.user.id === userId
                            );
                        }
    
                        const updatedFilteredAttedance = filteredattendance.map((item: any, index: number) => ({ ...item, id: index + 1 }));
                        const filteredData = updatedFilteredAttedance.filter((data: any) => {
                            const matchesGeneralFilter = this.generalFilter
                                ? JSON.stringify(data).toLowerCase().includes(this.generalFilter)
                                : true;
                            return matchesGeneralFilter;
                        });
    
                        this.dataSource.data = filteredData;
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
        this.attendanceService.getAllAttendanceData().subscribe((res: any) => {
            const ds = res;
            console.log(ds);

            this.dataSource = new MatTableDataSource<AttedanceModel>(ds);
            if (this.generalFilter === null || "") {
                ds.map((item: any, index: number) => ({ ...item, id: index + 1 }));
                const filteredData = ds.filter((data: any) => {
                    console.log(this.filterDate);
                    if (data.date) {
                        const matchesDate = data.date.toString().toLowerCase().includes(this.filterDate.toLowerCase());
                        return matchesDate;
                    }
                    return false;
                });

                this.dataSource.data = filteredData;
            } else {
                ds.map((item: any, index: number) => ({ ...item, id: index + 1 }));
                const filteredData = ds.filter((data: any) => {
                    console.log(this.filterDate);
                    if (data.date) {
                        const matchesDate = data.date.toString().toLowerCase().includes(this.filterDate.toLowerCase());
                        const matchesGeneralFilter = this.generalFilter
                            ? JSON.stringify(data).toLowerCase().includes(this.generalFilter)
                            : true;
                        return matchesDate && matchesGeneralFilter;
                    }
                    return false;
                });

                this.dataSource.data = filteredData;
            }
        });
    }
    //  search bar end

}
