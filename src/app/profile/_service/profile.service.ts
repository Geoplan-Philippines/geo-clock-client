import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
    providedIn: "root",
})
export class ProfileService {
    constructor(private _http: HttpClient) {}

    getCurrentUserData(userData: number): Observable<any> {
        console.log(userData);
        return this._http.post("http://localhost:3000/users", userData);
    }
    getAllemployeetData() {
      return this._http.get("http://localhost:3000/users");
  }
}
