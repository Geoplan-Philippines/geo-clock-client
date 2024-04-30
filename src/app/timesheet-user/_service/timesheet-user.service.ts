import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class TimesheetUserService {
    constructor(private _http: HttpClient) {}

    getEntryTimesheetData() {
        return this._http.get("http://localhost:8000/geo/api/v1/timesheet");
    }

    // getProjectTimesheetData() {
    //     return this._http.get("");
    // }
}
