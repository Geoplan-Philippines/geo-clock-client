import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from 'src/config/config.local';

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
    private apiUrl = config.apiUrl;

    constructor(private _http: HttpClient) {}

    // getAllemployeetData() {
    //     return this._http.get("http://localhost:8000/geo/api/v1/user");
    // }

    // getAllemployeetData() {
    //     return this._http.get("https://clockgeo.geoplanph.com/assets/data/user/employee.json");
    // }

    getAllemployeetData() {
        return this._http.get(`${this.apiUrl}/users`);
    }

    postAllEmployeeData(userData: any): Observable<any> {
        return this._http.post(`${this.apiUrl}/users`, userData);
    }

    patchEmployeeData(userId: number, userDataUpdate: any): Observable<any> {
        const url = `${this.apiUrl}/users/${userId}`;
        return this._http.patch(url, userDataUpdate);
    }

    //table classification and department

    getAllClassification() {
        return this._http.get(`${this.apiUrl}/classification`);
    }
    getAllDepartment() {
        return this._http.get(`${this.apiUrl}/department`);
    }
}
