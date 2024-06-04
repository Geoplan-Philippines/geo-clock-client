import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TimesheetSummaryModel } from "src/app/models/timesheet-summary.model";

@Injectable({
    providedIn: "root",
})
export class TimesheetSummaryService {
    constructor(private _http: HttpClient) {}

    //   getAllSummaryData() {
    //     return this._http.get("http://localhost:4200/assets/data/timesheet-summary.json");
    //
    private apiUrl = 'http://localhost:3000/timesheet-summary'; // Replace with your actual API URL

    // getAllSummaryData() {
    //     return this._http.get("http://localhost:3000/timesheet-summary");
    // }

    WeekNumberService() {
        return this._http.get("http://localhost:4200/assets/data/wknumber.json");
    }

    getAllSummaryData(): Observable<TimesheetSummaryModel[]> {
        return this._http.get<TimesheetSummaryModel[]>(this.apiUrl);
    }

    getFilteringYearAndWeek(week_no: number, Year: string){
        return this._http.get(`http://localhost:3000/timesheet-summary/${week_no}/${Year}`)
    }



}
