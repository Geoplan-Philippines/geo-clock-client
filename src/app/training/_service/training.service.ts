import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class TrainingService {
    constructor(private _http: HttpClient) {}

    // getAllTrainingData() {
    //     return this._http.get("http://localhost:4200/assets/data/training/training.json");
    // }

    getAllTrainingData() {
        return this._http.get("http://localhost:3000/trainings");
    }
}
