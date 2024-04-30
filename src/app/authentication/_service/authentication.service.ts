import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    constructor(private _http: HttpClient) {}

    getUser() {
        return this._http.get("http://localhost:3000/users");
    }

    logIn(){
      return this._http.get("http://localhost:8000/api/login");
    }
}
