
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
  {
    path: 'ai-assistant',
    loadComponent: () =>
      import('./pages/ai-assistant/ai-assistant')
        .then(m => m.AiAssistant)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
