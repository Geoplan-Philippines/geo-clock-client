import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class TimesheetApprovedService {
    constructor(private _http: HttpClient) {}

    getAllTimesheetData() {
        return this._http.get("http://localhost:4200/assets/data/timesheet-approved.json");
    }
    WeekNumberService() {
        return this._http.get("http://localhost:4200/assets/data/wknumber.json");
    }
}
