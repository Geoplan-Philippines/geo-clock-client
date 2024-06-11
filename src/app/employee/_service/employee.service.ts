import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class EmployeeService {
    constructor(private _http: HttpClient) {}

    // getAllemployeetData() {
    //     return this._http.get("http://localhost:8000/geo/api/v1/user");
    // }

    // getAllemployeetData() {
    //     return this._http.get("http://localhost:4200/assets/data/user/employee.json");
    // }

    getAllemployeetData() {
        return this._http.get("http://localhost:3000/users");
    }

    postAllEmployeeData(userData: any): Observable<any>{
        return this._http.post("http://localhost:3000/users",userData);
    }

    patchEmployeeData(userId: number, userDataUpdate: any): Observable<any> {
        const url = `http://localhost:3000/users/${userId}`;
        return this._http.patch(url, userDataUpdate);
    }

    //table classification and department

    getAllclassification() {
        return this._http.get("http://localhost:3000/classification");
    }
}
