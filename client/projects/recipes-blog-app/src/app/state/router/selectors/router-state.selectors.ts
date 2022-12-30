import { createFeatureSelector, createSelector } from '@ngrx/store';
import { routerStateConfig } from '../ngrx-router.module';
import { MergedRouteReducerState } from '../reducers';

export const getRouterReducerState = createFeatureSelector<MergedRouteReducerState>(
    routerStateConfig.stateKey
);

export const getMergedRouteState = createSelector(
    getRouterReducerState,
    routerReducerState => routerReducerState.state
);