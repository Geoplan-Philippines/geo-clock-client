import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TimesheetSummaryModel } from "src/app/models/timesheet-summary.model";
import { config } from 'src/config/config.local';

@Injectable({
    providedIn: "root",
})
export class TimesheetSummaryService {
    private apiUrl1 = config.apiUrl;
    private apiUrl2 = config.apiUrl1;
    constructor(private _http: HttpClient) {}

    //   getAllSummaryData() {
    //     return this._http.get("http://localhost:4200/assets/data/timesheet-summary.json");
    //
    private apiUrl = `${this.apiUrl1}/timesheet-summary`; // Replace with your actual API URL

    // getAllSummaryData() {
    //     return this._http.get("http://localhost:3000/timesheet-summary");
    // }

    WeekNumberService() {
        return this._http.get(`${this.apiUrl2}/assets/data/wknumber.json`);
    }

    getAllSummaryData(): Observable<TimesheetSummaryModel[]> {
        return this._http.get<TimesheetSummaryModel[]>(this.apiUrl);
    }

    getFilteringYearAndWeek(week_no: number, Year: string): Observable<TimesheetSummaryModel[]> {
        return this._http.get<TimesheetSummaryModel[]>(`${this.apiUrl1}/timesheet-summary/${week_no}/${Year}`);
    }
    



}
