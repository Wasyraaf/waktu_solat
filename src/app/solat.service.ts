import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PrayerTime {
    day: number;
    hijri: string;
    fajr: number;
    syuruk: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
}

export interface SolatResponse {
    zone: string;
    year: number;
    month: string;
    prayers: PrayerTime[];
}

@Injectable({
    providedIn: 'root'
})
export class SolatService {
    private apiUrl = 'https://api.waktusolat.app/v2/solat';

    constructor(private http: HttpClient) { }

    getPrayerTimes(zone: string): Observable<SolatResponse> {
        return this.http.get<SolatResponse>(`${this.apiUrl}/${zone}`);
    }

    getZones(): Observable<Zone[]> {
        return this.http.get<Zone[]>('https://api.waktusolat.app/zones');
    }
}

export interface Zone {
    jakimCode: string;
    negeri: string;
    daerah: string;
}
