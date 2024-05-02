import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class SummaryService {
    constructor(private _http: HttpClient) {}

    getAllDataUsers(userId: number){
        return this._http.get(`http://localhost:3000/users/${userId}`);
    }

    getAllTimesheetDaily(weekNo: number, userId: number, startDate: Date, endDate: Date) {
        return this._http.get(`http://localhost:3000/timesheet-approved/${weekNo}/${userId}/${startDate}/${endDate}`);
    }

    patchTimesheetEntry(timesheetId: number , data: any):Observable <any> {
        return this._http.patch(`http://localhost:3000/timesheet-entry/${timesheetId}`,data)

    }
    patchTimesheetApproved(ApprovedId: number, data: any):Observable <any>{
        return this._http.patch(`http://localhost:3000/timesheet-approved/${ApprovedId}`, data)
    }
}
