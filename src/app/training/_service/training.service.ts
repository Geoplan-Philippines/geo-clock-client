import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from 'src/config/config.local';

@Injectable({
    providedIn: 'root',
})
export class TrainingService {
    private apiUrl = config.apiUrl;

    constructor(private _http: HttpClient) {}

    // getAllTrainingData() {
    //     return this._http.get("https://clockgeo.geoplanph.com/assets/data/training/training.json");
    // }

    getAllTrainingData() {
        return this._http.get(`${this.apiUrl}/trainings`);
    }
}
