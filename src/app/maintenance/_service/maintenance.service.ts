import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { config } from 'src/config/config.local';

@Injectable({
    providedIn: "root",
})
export class MaintenanceService {
    private apiUrl = config.apiUrl;
    constructor(private _http: HttpClient) {}

    getAllDepartmentData() {
        return this._http.get(`${this.apiUrl}/department`);
    }

    postAllHolidayData(addedHoliday: any): Observable<any>{
        return this._http.post(`${this.apiUrl}/holiday`,addedHoliday);
    }

    postAllDepartmentData(addedDepartment: any): Observable<any>{
        return this._http.post(`${this.apiUrl}/department`,addedDepartment);
    }

    getAllHolidayData() {
        return this._http.get(`${this.apiUrl}/holiday`);
    }

}