import { Component, OnInit, inject, signal } from '@angular/core';
import { AirQualityService } from '../../services/air-quality';
import { AirQuality } from '../../model/air-quality.model';
import { CommonModule } from '@angular/common';
import { timer, EMPTY, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private airQualityService = inject(AirQualityService);

  readonly airQuality = signal<AirQuality | null>(null);

  loading = true;
  isRefreshing = false;
  errorMessage = '';

  private refreshSubscription?: Subscription;

  ngOnInit() {
    this.refreshSubscription = timer(0,2* 5 * 15 * 60 * 1000)
      .pipe(
        switchMap(() => {
          this.isRefreshing = true;
          return this.airQualityService.getAirQuality().pipe(
            catchError((error) => {
              console.error('Air quality refresh failed:', error);
              this.errorMessage = 'Unable to refresh air-quality data.';
              this.isRefreshing = false;
              this.loading = false;

              return EMPTY;
            }),
          );
        }),
      )
      .subscribe((data) => {
        this.airQuality.set(data);
        this.errorMessage = '';
        this.isRefreshing = false;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }
}
