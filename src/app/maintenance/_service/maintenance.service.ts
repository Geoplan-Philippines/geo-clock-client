import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { config } from "src/config/config.local";

@Injectable({
    providedIn: "root",
})
export class MaintenanceService {
    private apiUrl = config.apiUrl;
    constructor(private _http: HttpClient) {}

    getAllHolidayData() {
        return this._http.get(`${this.apiUrl}/holiday`);
    }

    getAllDepartmentData() {
        return this._http.get(`${this.apiUrl}/department`);
    }

    getAllClassificationData() {
        return this._http.get(`${this.apiUrl}/classification`);
    }

    getAllDifferentialData() {
        return this._http.get(`${this.apiUrl}/differential-hours`);
    }

    postAllHolidayData(addedHoliday: any): Observable<any> {
        return this._http.post(`${this.apiUrl}/holiday`, addedHoliday);
    }

    postAllDepartmentData(addedDepartment: any): Observable<any> {
        return this._http.post(`${this.apiUrl}/department`, addedDepartment);
    }

    postAllClassificationData(addedClassification: any): Observable<any> {
        return this._http.post(`${this.apiUrl}/classification`, addedClassification);
    }

    deleteData(id: any, table: any) {
        if (table === "holiday") {
            // console.log("pogi");
            return this._http.delete(`${this.apiUrl}/holiday/${id}`);
        } else if (table === "department") {
            // console.log("pogi2");
            return this._http.delete(`${this.apiUrl}/department/${id}`);
        } else {
            // console.log("pogi3");
            return this._http.delete(`${this.apiUrl}/classification/${id}`);
        } 
    }
    // deleteHoliday(id: any){
    //     return this._http.delete(`${this.apiUrl}/holidayTable/${id}`)
    // }
}
