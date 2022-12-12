import { createReducer, on } from '@ngrx/store';
import { IUser } from 'src/app/shared/interfaces';
import { login, logout } from './current-user.actions';

const initialCurrentUserState: IUser | null = null;

export const currentUserReducer = createReducer<IUser | null>(
    initialCurrentUserState,
    on(login, (state, action) => {

        // console.log(
        //     'CurrentUserStateReducer#onLogin', 
        //     `currentState: ${state} `, 
        //     `newStateFromProps: ${action.user}`
        // );

        return action.user;
    }),
    on(logout, () => {

        // console.log(
        //     'CurrentUserStateReducer#onLogout', 
        //     `currentState: ${state} `, 
        //     `newStateFromProps: ${initialCurrentUserState}`
        // );

        return initialCurrentUserState;
    })
);