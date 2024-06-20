import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { config } from 'src/config/config.local';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = config.apiUrl;

  constructor(private _http: HttpClient) {}

    getAllAttendanceData() {
        return this._http.get("http://localhost:4200/assets/data/attendance/attendance.json");
    }
}
