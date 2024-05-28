import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimesheetSummaryService {

  constructor(private _http: HttpClient) {}

//   getAllSummaryData() {
//     return this._http.get("http://localhost:4200/assets/data/timesheet-summary.json");
// 

  getAllSummaryData() {
    return this._http.get("http://localhost:3000/timesheet-summary");
  }
  
  WeekNumberService() {
    return this._http.get("http://localhost:4200/assets/data/wknumber.json");
}
}
