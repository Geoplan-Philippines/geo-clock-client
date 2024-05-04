import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class TimesheetApprovedService {
    constructor(private _http: HttpClient) {}

    getAllemployeetData() {
        return this._http.get("http://localhost:3000/users");
    }

    //timesheetApproved
    getAllTimesheetApprovedData(){
        return this._http.get(`http://localhost:3000/timesheet-approved`)
    }
    
    // getAllTimesheetData() {
    //     return this._http.get("http://localhost:4200/assets/data/timesheet-approved.json");
    // }
    // WeekNumberService() {
    //     return this._http.get("http://localhost:4200/assets/data/wknumber.json");
    // }
}
