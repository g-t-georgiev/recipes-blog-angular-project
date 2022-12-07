import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';


export interface ILocalState {
    showNavigation: boolean,
    showMenuButton: boolean
}

const initialState: ILocalState = {
    showNavigation: true,
    showMenuButton: false

};

@Injectable()
export class HeaderState extends ComponentStore<ILocalState> {

    constructor() {
        super(initialState);
    }

    // selectors 

    readonly localState$: Observable<ILocalState> = this.select((state) => state);

    // updaters 

    readonly toggleNavigationView = this.updater((state: ILocalState, showNavigation: boolean) => ({ ...state, showNavigation }));

    readonly toggleMenuBtnView = this.updater((state: ILocalState, showMenuButton: boolean) => ({ ...state, showMenuButton }));
    
}