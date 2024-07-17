// shared-analytics.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { WorkFromHomeData } from "src/app/models/wfh.model";
import { ProjectManhoursModel } from "src/app/models/dashboard.model";

@Injectable({
    providedIn: "root",
})
export class SharedAnalyticsService {
    constructor(private http: HttpClient) {}

    getAllWorkFromHome(): Observable<WorkFromHomeData[]> {
        return this.http.get<WorkFromHomeData[]>("http://localhost:3000/dashboard/wfh");
    }

    getAllDataOfProjectUsed(): Observable<ProjectManhoursModel[]> {
        return this.http.get<ProjectManhoursModel[]>("http://localhost:3000/dashboard/projects");
    }
}
