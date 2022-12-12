import { createReducer, on } from '@ngrx/store';
import { toggleDarkMode } from './dark-mode.actions';

const initialDarkModeState = false;

export const darkModeReducer = createReducer<boolean>(
    initialDarkModeState,
    on(toggleDarkMode, (state, action) => {

        // console.log(
        //     'DarkModeStateReducer#onToggleDarkMode', 
        //     `currentState: ${state} `, 
        //     `newStateFromProps: ${action.darkModeOn}`
        // );

        return action.darkModeOn;
    })
);