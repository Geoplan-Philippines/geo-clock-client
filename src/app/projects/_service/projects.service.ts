import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class ProjectsService {
    constructor(private _http: HttpClient) {}

    // getAllProjectData() {
    //     return this._http.get("http://localhost:3000/projects");
    // }

    getAllProjectData() {
        return this._http.get("http://localhost:3000/apptivo/api");
    }
}
