import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class SummaryService {
    constructor(private _http: HttpClient) {}

    getAllTimesheetDaily() {
        return this._http.get("http://localhost:4200/assets/data/summary.json");
    }
}
