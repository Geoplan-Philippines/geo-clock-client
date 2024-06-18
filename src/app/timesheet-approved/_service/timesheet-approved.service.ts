import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from 'src/config/config.local';
import { Observable } from "rxjs";
import { TimesheetApprovedModel } from "src/app/models/timesheet-approved.model";

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
    getAllTimesheetApprovedData(): Observable<TimesheetApprovedModel[]> {
        return this._http.get<TimesheetApprovedModel[]>(`${this.apiUrl}/timesheet-approved`);
    }

    getAllTimesheetApprovedDataByYearandWeek(year_no: string, week_no: number): Observable<TimesheetApprovedModel[]> {
        return this._http.get<TimesheetApprovedModel[]>(`${this.apiUrl}/timesheet-approved/${year_no}/${week_no}`);
    }

    // getAllTimesheetData() {
    //     return this._http.get("http://localhost:4200/assets/data/timesheet-approved.json");
    // }
    WeekNumberService() {
        return this._http.get(`${this.apiUrl1}/assets/data/wknumber.json`);
    }
}
