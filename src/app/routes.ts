import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { authFeature } from '@ngrx-example/shared/auth/state/auth.reducer';
import { AuthEffects } from '@ngrx-example/shared/auth/state/auth.effects';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import(
        '@ngrx-example/features/login/containers/login-container/login-container.component'
      ).then((c) => c.LoginContainerComponent),
    providers: [provideState(authFeature), provideEffects([AuthEffects])],
  },
  {
    path: 'home',
    loadComponent: () =>
      import(
        '@ngrx-example/features/home/containers/home-container/home-container.component'
      ).then((c) => c.HomeContainerComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
