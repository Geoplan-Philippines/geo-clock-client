import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from 'src/config/config.local';

@Injectable({
    providedIn: 'root',
})
export class TimesheetService {
    private apiUrl = config.apiUrl;
    constructor(private _http: HttpClient) {}

    getAllTimesheetData(timesheetId: number) {
        return this._http.get(`${this.apiUrl}/timesheets/tables/${timesheetId}`);
    }

    getAllProjectData() {
        return this._http.get(`${this.apiUrl}/apptivo/api`);
    }

    getalltimesheetbydate(user_id: number, start_date: String, end_date: String) {
        return this._http.get(
            `${this.apiUrl}/timesheets/filtering/${user_id}/${start_date}/${end_date}`
        );
    }

    postTimesheetEntry(data: any) {
        console.log('timesheet', data);
        return this._http.post(`${this.apiUrl}/timesheet-entry/whole`, data);
    }

    editTimesheetEntry(id: any, data: any) {
        return this._http.patch(`${this.apiUrl}/timesheet-entry/${id}`, data);
    }

    deleteTimesheetEntry(id: any) {
        return this._http.delete(`${this.apiUrl}/timesheet-entry/${id}`);
    }

    postProject(data: any) {
        console.log('post', data);
        return this._http.post(`${this.apiUrl}/timesheet-entry/whole`, data);
    }

    getProjectName() {
        return this._http.get(`${this.apiUrl}/projects`);
    }

    postProjectName(projectName: string): Observable<any> {
        const body = { project_name: projectName }; // Create an object with the project_name property
        return this._http.post(`${this.apiUrl}/projects`, body);
    }

    getAlltimesheetDataByDate(userId: number, inputDate: Date) {
        return this._http.get(`${this.apiUrl}/timesheets/refresh/${userId}/${inputDate}`);
    }

    //timesheetApproved
    getAllTimesheetApprovedData() {
        return this._http.get(`${this.apiUrl}/timesheet-approved`);
    }

    postAlltimesheetApproved(data: any): Observable<any> {
        return this._http.post(`${this.apiUrl}/timesheet-approved`, data);
    }

    getUserLoadById(userId: number) {
        return this._http.get(`${this.apiUrl}/users/${userId}`);
    }

    //holiday table
    getAllDataHoliday() {
        return this._http.get(`${this.apiUrl}/holiday`);
    }
}
