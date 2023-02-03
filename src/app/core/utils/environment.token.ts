import { InjectionToken, ValueProvider } from '@angular/core';
import { IEnvironment } from 'src/app/core/config/i-environment';


export const ENVIRONMENT = new InjectionToken<IEnvironment>('ENVIRONMENT');

export const getEnvironmentProvider = (value: IEnvironment): ValueProvider => ({
    provide: ENVIRONMENT,
    useValue: value
});