import { createSelector } from '@ngrx/store';
import { IRootState } from '..';

export interface IDarkModeFeature {
    darkModeOn: boolean
}

export const selectDarkModeFeature = (state: IRootState) => state.darkModeOn;

export const selectDarkModeFeatureValue = createSelector(
    selectDarkModeFeature,
    (darkModeOn: boolean) => darkModeOn
)