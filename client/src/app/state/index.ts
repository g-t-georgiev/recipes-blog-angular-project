import { IUser } from '../shared/interfaces';

export interface IRootState {
    darkModeOn: boolean;
    currentUser: IUser | null;
};

export * as theme from './dark-mode';
export * as currentUser from './current-user';