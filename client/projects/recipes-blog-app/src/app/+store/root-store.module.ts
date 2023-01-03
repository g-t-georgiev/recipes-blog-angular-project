import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
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
        EffectsModule.forRoot([]),
    ],
    exports: [
        StoreModule, 
        EffectsModule, 
    ]
})
export class RootStoreModule { }