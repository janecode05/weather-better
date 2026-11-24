
import { Component, OnInit, inject } from '@angular/core';
import { AirQualityService } from '../../services/air-quality';
import { AirQuality } from '../../model/air-quality.model';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  private airQualityService = inject(AirQualityService);

  airQuality: AirQuality | null = null;

  ngOnInit(): void {
    this.airQualityService.getAirQuality().subscribe(data => {
      this.airQuality = data;
    });
  }
}
