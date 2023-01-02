import { createAction, props } from '@ngrx/store';
import { IUser } from 'projects/recipes-blog-app/src/app/shared/interfaces';

const currentUserDomain = '[CurrentUserDomain]';
export const login = createAction(`${currentUserDomain} Login`, props<{ user: IUser }>());
export const logout = createAction(`${currentUserDomain} Logout`);