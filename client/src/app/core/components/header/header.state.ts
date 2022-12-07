import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { withLatestFrom, mergeMap, tap } from 'rxjs/operators';
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

    readonly showNavigation$: Observable<boolean> = this.select(({ showNavigation }) => showNavigation);

    // updaters 

    readonly updateNavigationState = this.updater((state: ILocalState, showNavigation: boolean) => ({ ...state, showNavigation }));

    readonly updateMenuBtnToggleState = this.updater((state: ILocalState, showMenuButton: boolean) => ({ ...state, showMenuButton }));

    // effects 

    readonly toggleNavigation = this.effect(
        (showNavigation$: Observable<boolean>) => {
            return showNavigation$.pipe(
                tap((value: boolean) => {
                    // console.log('New navigation state: ', value ? 'opened' : 'closed');
                    this.updateNavigationState(value);
                })
            );
        }
    );
    
}