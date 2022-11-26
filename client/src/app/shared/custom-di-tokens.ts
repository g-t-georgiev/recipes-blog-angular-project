import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<typeof globalThis & Window>(
    'Global Object DI Token', 
    { 
        providedIn: 'root', 
        factory: () => window || globalThis 
    });