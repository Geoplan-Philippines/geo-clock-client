import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from 'src/config/config.local';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AttendanceService {
    private apiUrl = config.apiUrl;

    constructor(private _http: HttpClient) {}

    // getAllAttendanceData() {
    //     return this._http.get("https://clockgeo.geoplanph.com/assets/data/attendance/attendance.json");
    // }

    getAllAttendanceData(date: string) {
        return this._http.get(`${this.apiUrl}/attendance/${date}`);
    }

    // getAllAttendanceData(type: string) {
    //   return this._http.get(`${this.apiUrl}/attendance/${type}`);
    // }

    postAllDataInitialTimeIn(data: any) {
        return this._http.post(`${this.apiUrl}/attendance/initial`, data);
    }

    postAllDataTimeIn(data: any) {
        return this._http.post(`${this.apiUrl}/attendance`, data);
    }

    updateAllDataInitialTimeOut(userId: number, dateTime: any, statuses: string, data: any) {
        return this._http.patch(
            `${this.apiUrl}/attendance/initial/${userId}/${dateTime}/${statuses}`,
            data
        );
    }
    updateAllDataTimeOut(userId: number, dateTime: any, statuses: string, data: any) {
        return this._http.patch(
            `${this.apiUrl}/attendance/${userId}/${dateTime}/${statuses}`,
            data
        );
    }

    getAllDataDiff(): Observable<any[]> {
        return this._http.get<any[]>(`${this.apiUrl}/attendance/diff`);
    }

    getAllemployeetData() {
        return this._http.get(`${this.apiUrl}/users`);
    }
}
