import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from 'src/config/config.local';

@Injectable({
    providedIn: 'root',
})
export class SummaryService {
    private apiUrl = config.apiUrl;
    private apiUrl1 = config.apiUrl1;
    constructor(private _http: HttpClient) {}
 
    getAllDataUsers(userId: number) {
        return this._http.get(`${this.apiUrl}/users/${userId}`);
    }

    getAllTimesheetDaily(weekNo: number, userId: number, startDate: Date, endDate: Date) {
        return this._http.get(
            `${this.apiUrl}/timesheet-approved/${weekNo}/${userId}/${startDate}/${endDate}`
        );
    }

    patchTimesheetEntry(entryId: number, data: any): Observable<any> {
        return this._http.patch(
            `${this.apiUrl}/timesheet-entry/${entryId}`,
            data
        );
    }
    patchTimesheetApproved(
        userNumber: number,
        yearNumber: any,
        week_number: number,
        data: any
    ): Observable<any> {
        return this._http.patch(
            `${this.apiUrl}/timesheet-approved/${userNumber}/${yearNumber}/${week_number}`,
            data
        );
    }

    //Data Timesheet Summary
    getAllSummaryData() {
        return this._http.get(`${this.apiUrl}/timesheet-summary`);
    }
    getAllSummaryDataWithId(weekNo: number, Date: string, user_id: number) {
        return this._http.get(
            `${this.apiUrl}/timesheet-summary/${weekNo}/${Date}/${user_id}`
        );
    }

    postTimesheetSummary(Summary: any) {
        return this._http.post(`${this.apiUrl}/timesheet-summary`, Summary);
    }
}
