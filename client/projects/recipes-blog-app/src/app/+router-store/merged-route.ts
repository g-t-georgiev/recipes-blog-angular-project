import { Data, Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';

export interface MergedRoute {
    url: string;
    params: Params;
    queryParams: Params;
    data: Data;
}

export type MergedRouteReducerState = RouterReducerState<MergedRoute>;