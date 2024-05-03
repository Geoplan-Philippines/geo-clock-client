import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WholeDeleteService {

  constructor(private _http: HttpClient) {}


  deleteTimesheetEntry(user_id: number, project_id: number, start_date: Date, end_date: Date){
    return this._http.delete(`http://localhost:3000/timesheet-entry/${user_id}/${project_id}/${start_date}/${end_date}`)
  }
}
