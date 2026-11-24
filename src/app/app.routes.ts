
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
  {
    path: 'air-quality',
    loadComponent: () =>
      import('./pages/air-quality/air-quality')
        .then(m => m.AirQuality)
  },
  {
    path: 'recommendations',
    loadComponent: () =>
      import('./pages/recommendations/recommendations')
        .then(m => m.Recommendations)
  },
  {
    path: 'indoor-tips',
    loadComponent: () =>
      import('./pages/indoor-tips/indoor-tips')
        .then(m => m.IndoorTips)
  },
  {
    path: 'ai-assistant',
    loadComponent: () =>
      import('./pages/ai-assistant/ai-assistant')
        .then(m => m.AiAssistant)
  },
  {
    path: 'action-planner',
    loadComponent: () =>
      import('./pages/action-planner/action-planner')
        .then(m => m.ActionPlanner)
  }
];

