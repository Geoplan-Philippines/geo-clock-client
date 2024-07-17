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

    postAllDataInitialTimeIn(data: any){
      return this._http.post(`${this.apiUrl}/attendance/initial`, data)
    }

    postAllDataTimeIn(data: any){
      return this._http.post(`${this.apiUrl}/attendance`, data)
    }

    // postAllAttendanceData(data: any){
    //   return this._http.post(`${this.apiUrl}/attendance`, data)
    // }

    // updateAllAttendanceData(userId: number, dateTime: any ,type:string, data: any){
    //   return this._http.patch(`${this.apiUrl}/attendance/${userId}/${dateTime}/${type}`, data)
    // }
    
    updateAllDataInitialTimeOut(userId: number, dateTime: any ,statuses:string, data: any){
      return this._http.patch(`${this.apiUrl}/attendance/initial/${userId}/${dateTime}/${statuses}`, data)
    }
    updateAllDataTimeOut(userId: number, dateTime: any ,statuses:string, data: any){
      return this._http.patch(`${this.apiUrl}/attendance/${userId}/${dateTime}/${statuses}`, data)
    }

    getAllDataDiff(){
      return this._http.get(`${this.apiUrl}/attendance/diff`);
    };

// gg
    getAllemployeetData() {
      return this._http.get(`${this.apiUrl}/users`);
    }

    updateTimeInAttenadance(userId: number, date: any ,type:string, data:any){
      return this._http.patch(`${this.apiUrl}/attendance/timeInUpdate/${userId}/${date}/${type}`, data)
    }

    updateAlreadyDataAttenadance(userId: number, date: any ,type:string, data:any){
      return this._http.patch(`${this.apiUrl}/attendance/alreadyData/${userId}/${date}/${type}`, data)
    }

}
