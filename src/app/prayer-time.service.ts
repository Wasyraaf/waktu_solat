import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrayerTimeService {
  private apiUrl = 'https://api.aladhan.com/v1/timingsByCity?city=Cyberjaya&country=Malaysia&method=2';

  constructor(private http: HttpClient) { }

  getPrayerTimes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
