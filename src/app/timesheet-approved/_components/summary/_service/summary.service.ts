import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class SummaryService {
    constructor(private _http: HttpClient) {}

    getAllTimesheetDaily(weekNo: number, userId: number, startDate: Date, endDate: Date) {
        return this._http.get(`http://localhost:3000/timesheet-approved/${weekNo}/${userId}/${startDate}/${endDate}`);
    }
}
