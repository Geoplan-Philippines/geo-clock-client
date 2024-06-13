import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { config } from 'src/config/config.local';
@Injectable({
    providedIn: "root",
})
export class ProjectsService {
    private apiUrl = config.apiUrl;
    constructor(private _http: HttpClient) {}

    // getAllProjectData() {
    //     return this._http.get("http://localhost:3000/projects");
    // }

    getAllProjectData() {
        return this._http.get(`${this.apiUrl}/apptivo/api`);
    }
}
