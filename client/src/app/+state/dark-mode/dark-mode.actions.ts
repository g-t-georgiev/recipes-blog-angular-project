import { createAction, props } from '@ngrx/store';

const colorThemeDomain = '[ColorTheme]';
export const toggleDarkMode = createAction(`${colorThemeDomain} ToggleDarkMode`, props<{ darkModeOn: boolean }>());