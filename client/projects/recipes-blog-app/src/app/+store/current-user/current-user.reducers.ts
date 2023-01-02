import { createReducer, on } from '@ngrx/store';
import { IUser } from 'projects/recipes-blog-app/src/app/shared/interfaces';
import { login, logout } from './current-user.actions';

const initialState: IUser | null = null;

export const currentUserReducer = createReducer<IUser | null>(
    initialState,
    on(login, (_, action) => action.user ),
    on(logout, () => initialState )
);