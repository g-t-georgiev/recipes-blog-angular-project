import { NgModule, Optional, Self } from "@angular/core";
import { Router } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { routerReducer, RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';

import { MergedRouterStateSerializer } from "./merged-route-serializer";
import { RouterEffects } from "./router.effects";

export const routerStateConfig = {
    stateKey: 'router',
    serializer: MergedRouterStateSerializer
}

@NgModule({
    imports: [
        StoreModule.forFeature(routerStateConfig.stateKey, routerReducer), 
        EffectsModule.forFeature([ RouterEffects ]),
        StoreRouterConnectingModule.forRoot(routerStateConfig)
    ],
    exports: [
        StoreModule,
        StoreRouterConnectingModule
    ],
    providers: [
        {
            provide: RouterStateSerializer,
            useClass: MergedRouterStateSerializer
        }
    ]
})
export class NgrxRouterStoreModule {

    constructor(@Self() @Optional() router: Router) { 
        if (router) {
            console.log('All good, NgrxStoreModule');
        } else {
            console.log('NgrxRouterStoreModule must be imported at the same level as RouterModule');
        }
    }
}