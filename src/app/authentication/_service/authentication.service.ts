import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/config/config.local';
@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private apiUrl = config.apiUrl;
    constructor(private _http: HttpClient) {}

    getUser() {
        return this._http.get(`${this.apiUrl}/users`);
    }

    logIn() {
        return this._http.get('http://localhost:8000/api/login');
    }
}
