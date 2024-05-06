import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private _http: HttpClient) {}

  getSidebarModule(role: string){
    return this._http.get(`http://localhost:3000/sidebar/${role}`)
  }
}
