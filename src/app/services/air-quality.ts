
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AirQuality } from '../model/air-quality.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AirQualityService {

   private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/air-quality';

  getAirQuality(): Observable<AirQuality> {
    return this.http.get<AirQuality>(this.apiUrl);
  }
}

