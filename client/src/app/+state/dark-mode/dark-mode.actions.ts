import { createAction, props } from '@ngrx/store';

const colorThemeDomain = '[ColorThemeDomain]';
export const toggleDarkMode = createAction(`${colorThemeDomain} ToggleDarkMode`, props<{ darkModeOn: boolean }>());