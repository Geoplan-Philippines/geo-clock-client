import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AsideService {
    constructor(private _http: HttpClient) {}

    getSidebarModule(role: string) {
        return this._http.get(`https://clockgeo.geoplanph.com/api/sidebar/${role}`);
    }
}
