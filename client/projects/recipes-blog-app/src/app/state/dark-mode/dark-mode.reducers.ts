import { createReducer, on } from '@ngrx/store';
import { toggleDarkMode } from './dark-mode.actions';

const initialState = false;

export const darkModeReducer = createReducer<boolean>(
    initialState,
    on(toggleDarkMode, (_, action) => action.darkModeOn )
);