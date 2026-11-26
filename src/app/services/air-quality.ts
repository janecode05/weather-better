import { environment } from '../../environment/environment';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AirQuality } from '../model/air-quality.model';
import { HttpClient } from '@angular/common/http';


interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class AirQualityService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/airquality';
  private apichatUrl = environment.apiUrl + '/chat';

  getAirQuality(): Observable<AirQuality> {
    return this.http.get<AirQuality>(this.apiUrl);
  }

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apichatUrl, {
      message: message
    });
  }
}

