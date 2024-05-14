import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class TimesheetService {
    constructor(private _http: HttpClient) {}

    getAllTimesheetData(timesheetId: number) {
        return this._http.get(`http://localhost:3000/timesheets/tables/${timesheetId}`);
    }

    getAllProjectData() {
        return this._http.get("http://localhost:3000/apptivo/api");
    }

    getalltimesheetbydate(user_id: number, start_date: String, end_date: String) {
        return this._http.get(`http://localhost:3000/timesheets/filtering/${user_id}/${start_date}/${end_date}`);
    }

    postTimesheetEntry(data: any){
        console.log('timesheet', data)
        return this._http.post("http://localhost:3000/timesheet-entry/whole", data)
    }

    editTimesheetEntry(id: any, data: any){
        return this._http.patch(`http://localhost:3000/timesheet-entry/${id}`, data)
    }

    deleteTimesheetEntry(id: any){
        return this._http.delete(`http://localhost:3000/timesheet-entry/${id}`)
    }

    postProject(data: any){
        console.log('post', data)
        return this._http.post("http://localhost:3000/timesheet-entry/whole", data)
    }
    
    getProjectName(){
        return this._http.get(`http://localhost:3000/projects`);
    };

    postProjectName(projectName: string): Observable<any> {
        const body = { project_name: projectName }; // Create an object with the project_name property
        return this._http.post("http://localhost:3000/projects", body);
    }

    getAlltimesheetDataByDate(userId: number, inputDate: Date){
        return this._http.get(`http://localhost:3000/timesheets/refresh/${userId}/${inputDate}`);
    }

    //timesheetApproved
    getAllTimesheetApprovedData(){
        return this._http.get(`http://localhost:3000/timesheet-approved`)
    }

    postAlltimesheetApproved(data: any): Observable<any>{
        return this._http.post(`http://localhost:3000/timesheet-approved`,data);
    }

    getUserLoadById(userId: number){
        return this._http.get(`http://localhost:3000/users/${userId}`);
    }
}
