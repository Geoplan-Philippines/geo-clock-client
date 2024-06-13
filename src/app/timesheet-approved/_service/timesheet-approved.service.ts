import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from 'src/config/config.local';

@Injectable({
    providedIn: "root",
})
export class TimesheetApprovedService {
    private apiUrl = config.apiUrl;
    private apiUrl1 = config.apiUrl1;
    constructor(private _http: HttpClient) {}

    getAllemployeetData() {
        return this._http.get(`${this.apiUrl}/users`);
    }

    //timesheetApproved
    getAllTimesheetApprovedData() {
        return this._http.get(`${this.apiUrl}/timesheet-approved`);
    }

    // getAllTimesheetData() {
    //     return this._http.get("http://localhost:4200/assets/data/timesheet-approved.json");
    // }
    WeekNumberService() {
        return this._http.get(`${this.apiUrl1}/assets/data/wknumber.json`);
    }
}
