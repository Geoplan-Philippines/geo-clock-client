import { Component, OnDestroy, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { interval, Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { AttedanceModel } from "../models/attedance.model";
import { AttendanceService } from "./_service/attendance.service";
import { EncryptionService } from "../authentication/_guards/encrpytion.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import * as moment from 'moment-timezone';

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

    getShift(currentTime: Date): string {
        const hour = currentTime.getHours();
        if (hour >= 22 || hour < 6) {
          return "ND";
        } else if (hour >= 8 && hour < 18) {
          return "DW";
        } else {
          return "Undefined Shift";
        }
    }
        
    timeIn() {
        const currentDateTime = new Date().toISOString();
        const date= this.datePipe.transform(currentDateTime, "yyyy-MM-dd", "Asia/Manila");
        const type = this.getShift(new Date(currentDateTime))
        const dateTime = this.datePipe.transform(currentDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", "Asia/Manila");
        const user = this.encrypt.getItem("id");
        console.log(user);
      
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;


            fetch(nominatimUrl)
            .then(response => response.json())
            .then(data => {
                console.log('Reverse Geocoding Result:', data.display_name);
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
                    console.log("Time In successfully:", response);
                    this.loadAttendance();
                },
                error: (error: any) => {
                    console.error("Error creating entry:", error);
                }
                });
                })

            .catch(error => {
              console.error('Error fetching geocoding data:', error);
            }); 
     
          },
          (error) => {
            console.error('Error getting location', error);
          }
        );
      }
      formatDateToString(currentDateTime: Date): string {
        const dateString = this.datePipe.transform(currentDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", "Asia/Manila");
        return dateString || '';
      }
    // time in click end
    // time out click start

        getShiftTimeOut(currentTime: Date): string {
            const hour = currentTime.getHours();
            const date = new Date(currentTime);

            date.setHours(date.getHours() + 8);
        
            if (hour >= 22 || hour < 6) {
                // Night shift
                date.setDate(date.getDate() - 1); 
                return date.toISOString(); 
            } else if (hour >= 8 && hour < 18) {
                // Day shift
                return date.toISOString(); 
            } else {
                return "Undefined Shift";
            }
        }

        getDateType(currentTime: Date): string {
            const hour = currentTime.getHours();
            const date = currentTime;
            console.log("check", date)
            if (hour >= 22 || hour < 6) {
                // Night shift
                if (hour >= 1 && hour < 6) {
                    date.setDate(date.getDate() - 1); // Subtract one day
                }
                const formattedDate = this.datePipe.transform(date, "yyyy-MM-dd", "Asia/Manila");
                return formattedDate || ''; 
            } else if (hour >= 8 && hour < 18) {
                // Day shift
                const formattedDate = this.datePipe.transform(date, "yyyy-MM-dd", "Asia/Manila");
                return formattedDate || ''; 
            } else {
                return "Undefined Shift";
            }
        }

      timeOut() {
        const currentDateTime = new Date().toISOString();
        // const currentDateSample = "2024-06-27T14:00:00.000Z";
        const user = this.encrypt.getItem("id");
        console.log(user);


        const type = this.getShift(new Date(currentDateTime));
        const time_out_ND = this.getShiftTimeOut(new Date(currentDateTime));
        const date = this.getDateType(new Date(currentDateTime));
        
        const dataTimeOut = {
            type: type,
            time_out_ND: time_out_ND,
            date: date
        }
        console.log("siya toh",dataTimeOut)


        const time_in = this.filterData;
       



        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

            fetch(nominatimUrl)
            .then(response => response.json())
            .then(data => {
                console.log('Reverse Geocoding Result:', data.display_name);
                const dataAttendance = {
                    time_out: time_out_ND,
                    time_out_location: data.display_name,
                };
                console.log(data);
                this.attendanceService.updateAllAttendanceData(user, date, type, dataAttendance).subscribe({
                next: (response: any) => {
                    console.log("Time out successfully:", response);
                    this.loadAttendance();
                },
                error: (error: any) => {
                    console.error("Error creating entry:", error);
                }
                });
                })

            .catch(error => {
              console.error('Error fetching geocoding data:', error);
            }); 
     
          },
          (error) => {
            console.error('Error getting location', error);
          }
        );
      }
      
    //time out click end

    // history table start
    loadAttendance() {
        const user = this.encrypt.getItem("id");
        this.attendanceService.getAllAttendanceData().subscribe((res: any) => {
            const ds = res;
            console.log(ds);

            this.dataSource = new MatTableDataSource<AttedanceModel>(ds);

            ds.map((item: any, index: number) => ({ ...item, id: index + 1 }));
            const filteredData = ds.filter((data: any) => {
                const matchesGeneralFilter = this.generalFilter
                    ? JSON.stringify(data).toLowerCase().includes(this.generalFilter)
                    : true;
                return matchesGeneralFilter;
            });
            this.dataSource.data = filteredData;
            const firstdate = new Date()
         


            const dateString = this.datePipe.transform(firstdate, "yyyy-MM-dd", "Asia/Manila");
            console.log(dateString)
            const findTimeIn = ds.find((attendanceData: any) => 
                attendanceData.date === dateString && attendanceData.user.id === user
              );
            
            this.filterData = findTimeIn.time_in
            
            console.log(findTimeIn.time_in)
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
