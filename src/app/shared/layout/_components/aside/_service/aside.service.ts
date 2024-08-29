import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/config/config.local';

@Injectable({
  providedIn: 'root'
})
export class AsideService {

  constructor(private _http: HttpClient) {}
  private apiUrl = config.apiUrl;
  getSidebarModule(role: string){
    return this._http.get(`${this.apiUrl}/sidebar/${role}`)
  }
}
