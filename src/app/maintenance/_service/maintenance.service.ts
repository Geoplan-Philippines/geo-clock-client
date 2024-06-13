import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: "root",
})
export class MaintenanceService {
    constructor(private _http: HttpClient) {}

    getAllDepartmentData() {
        return this._http.get(`http://localhost:3000/department`);
    }
    postAllDepartmentData(addedDepartment: any): Observable<any>{
        return this._http.post("http://localhost:3000/department",addedDepartment);
    }
}
