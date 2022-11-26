import { createAction, props } from '@ngrx/store';

const darkModeToggleDomain = '[DarkModeToggleService]';
export const toggleDarkMode = createAction(`${darkModeToggleDomain} ToggleDarkMode`, props<{ darkModeOn: boolean }>());