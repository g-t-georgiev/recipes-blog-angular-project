import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";

import { IUser } from "../shared/interfaces";

import { currentUserReducer } from './current-user/current-user.reducers';
import { darkModeReducer } from './dark-mode/dark-mode.reducers';

export interface IRootState {
    darkModeOn: boolean;
    currentUser: IUser | null;
};

@NgModule({
    imports: [
        StoreModule.forRoot<IRootState>({
            darkModeOn: darkModeReducer,
            currentUser: currentUserReducer
        }),
    ],
    exports: [
        StoreModule
    ]
})
export class RootStoreModule { }