import { importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppComponent } from './app/app.component';
import { routes } from './app/routes';
import { environment } from 'src/environments/environment';
import { getEnvironmentProvider } from './app/core/utils/environment.token';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule, RouterModule.forRoot(routes)),
    provideStore(),
    provideEffects({}),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    getEnvironmentProvider(environment),
  ],
});
