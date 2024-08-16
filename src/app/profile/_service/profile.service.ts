import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from 'src/config/config.local';
@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private apiUrl = config.apiUrl;
    constructor(private _http: HttpClient) {}

    getCurrentUserData(userData: number): Observable<any> {
        console.log(userData);
        return this._http.post(`${this.apiUrl}/users`, userData);
    }
    getAllemployeetData() {
        return this._http.get(`${this.apiUrl}/users`);
    }
}
