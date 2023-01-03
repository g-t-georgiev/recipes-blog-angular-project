import { NavigationExtras } from '@angular/router';
import { createAction, props } from '@ngrx/store';

export enum RouterActionTypes {
    Go = '[Router] Go', 
}

export type RouterPayload = {
    payload: {
        path: any[],
        query?: object,
        relativeToCurrentRoute: boolean,
        extras?: NavigationExtras
    }
}

export class RouterActions {

    static readonly go = createAction(RouterActionTypes.Go, props<RouterPayload>());

}