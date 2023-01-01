import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { tap, mergeMap, catchError } from 'rxjs/operators';
import { ComponentStore } from '@ngrx/component-store';
import { Router } from '@angular/router';

import { AuthService, ViewportResizeService } from '../../services';


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
        private readonly vpResizeService: ViewportResizeService,
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
        super(initialState);
    }

    readonly localState$: Observable<ILocalState> = this.select((state) => state);
    readonly showNavigation$: Observable<boolean> = this.select(({ showNavigation }) => showNavigation);
    readonly signingOut$: Observable<boolean> = this.select(({ signingOut }) => signingOut);

    readonly updateHeaderState = this.updater(
        (
            state: ILocalState, 
            { showMenuButton, showNavigation }: Pick<ILocalState, 'showNavigation' | 'showMenuButton'>
        ) => ({ 
            ...state, 
            showMenuButton, 
            showNavigation 
        })
    );

    readonly updateSignoutStatus = this.updater(
        (
            state: ILocalState, 
            signingOut: boolean
        ) => ({ 
            ...state, 
            signingOut 
        })
    );

    readonly maxwidthMatchEffect = this.effect(
        (maxwidthMatch$: Observable<boolean>) => {
            return maxwidthMatch$.pipe(
                mergeMap((matches) => {

                    this.updateHeaderState({ showMenuButton: matches, showNavigation: !matches }).unsubscribe();

                    return this.vpResizeService.onMaxWidth780$.pipe(
                        tap(({ matches }) => {

                            this.updateHeaderState({ showMenuButton: matches, showNavigation: !matches }).unsubscribe();
                        })
                    )
                })
            )
        }
    );

    readonly logoutEffect = this.effect(
        (empty$: Observable<undefined>) => {
            return empty$.pipe(
                tap(() => {
                    this.updateSignoutStatus(true).unsubscribe();
                }),
                mergeMap(() => {
                    return this.authService.logout$().pipe(
                        tap(({ message }) => {
                            console.log(message);
                            this.updateSignoutStatus(false).unsubscribe();
                            this.router.navigate(['/users', 'login']);
                        }),
                        catchError((error) => {

                            // console.error(error);

                            this.updateSignoutStatus(false).unsubscribe();
                            let errorMsg;

                            if (error.status === 0) {
                                errorMsg = 'Connection error';
                            } else {
                                errorMsg = error.error?.message ?? error?.message ?? error.statusText ?? 'Something went wrong';
                            }

                            return EMPTY;
                        })
                    );
                })
            );
        }
    );
    
}