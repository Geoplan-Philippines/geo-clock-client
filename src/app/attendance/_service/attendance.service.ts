import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { config } from 'src/config/config.local';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = config.apiUrl;

  constructor(private _http: HttpClient) {}

    // getAllAttendanceData() {
    //     return this._http.get("http://localhost:4200/assets/data/attendance/attendance.json");
    // }

    getAllAttendanceData() {
      return this._http.get(`${this.apiUrl}/attendance`);
    }

    // getAllAttendanceData(type: string) {
    //   return this._http.get(`${this.apiUrl}/attendance/${type}`);
    // }

    postAllAttendanceData(data: any){
      return this._http.post(`${this.apiUrl}/attendance`, data)
    }

    updateAllAttendanceData(userId: number, dateTime: any ,type:string, data: any){
      return this._http.patch(`${this.apiUrl}/attendance/${userId}/${dateTime}/${type}`, data)
    }
    
    getAllemployeetData() {
      return this._http.get(`${this.apiUrl}/users`);
    }

    updateTimeInAttenadance(userId: number, date: any ,type:string, data:any){
      return this._http.patch(`${this.apiUrl}/attendance/timeInUpdate/${userId}/${date}/${type}`, data)
    }

}
