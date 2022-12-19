import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';
import { ComponentStore } from '@ngrx/component-store';

import { ViewportResizeService } from '../../services';


export interface ILocalState {
    showNavigation: boolean,
    showMenuButton: boolean,
    signingOut: boolean
}

const initialState: ILocalState = {
    showNavigation: true,
    showMenuButton: false,
    signingOut: false
};

@Injectable()
export class HeaderComponentState extends ComponentStore<ILocalState> {

    constructor(
        private readonly vpResizeService: ViewportResizeService
    ) {
        super(initialState);
    }

    readonly localState$: Observable<ILocalState> = this.select((state) => state);
    readonly showNavigation$: Observable<boolean> = this.select(({ showNavigation }) => showNavigation);
    readonly signingOut$: Observable<boolean> = this.select(({ signingOut }) => signingOut);

    readonly updateNavigationState = this.updater((state: ILocalState, showNavigation: boolean) => ({ ...state, showNavigation }));
    readonly updateMenuBtnToggleState = this.updater((state: ILocalState, showMenuButton: boolean) => ({ ...state, showMenuButton }));
    readonly updateSignoutStatus = this.updater((state: ILocalState, signingOut: boolean) => ({ ...state, signingOut }));

    // effects 

    readonly toggleNavigation = this.effect(
        (showNavigation$: Observable<boolean>) => {
            return showNavigation$.pipe(
                tap((value: boolean) => {

                    this.updateNavigationState(value);
                })
            );
        }
    );

    readonly maxwidthMatchEffect = this.effect(
        (maxwidthMatch$: Observable<boolean>) => {
            return maxwidthMatch$.pipe(
                mergeMap((matches) => {
                    this.updateMenuBtnToggleState(matches);
                    this.toggleNavigation(!matches);

                    return this.vpResizeService.onMaxWidth780$.pipe(
                        tap(({ matches }) => {
                            this.updateMenuBtnToggleState(matches);
                            this.toggleNavigation(!matches);
                        })
                    )
                })
            )
        }
    );
    
}