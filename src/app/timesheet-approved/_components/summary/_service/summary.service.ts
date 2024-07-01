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

    patchTimesheetEntry(entryId: number , data: any):Observable <any> {
        return this._http.patch(`http://localhost:3000/timesheet-entry/${entryId}`,data)

    }
    patchTimesheetApproved(userNumber:number,yearNumber: any, week_number: number, data: any):Observable <any>{
        return this._http.patch(`http://localhost:3000/timesheet-approved/${userNumber}/${yearNumber}/${week_number}`, data)
    }

    //Data Timesheet Summary
    getAllSummaryData() {
        return this._http.get("http://localhost:3000/timesheet-summary");
      }
    getAllSummaryDataWithId(weekNo: number, Date: string, user_id:number) {
        return this._http.get(`http://localhost:3000/timesheet-summary/${weekNo}/${Date}/${user_id}`);
    }

    postTimesheetSummary(Summary: any){
        return this._http.post(`http://localhost:3000/timesheet-summary`,Summary)
    }

}
