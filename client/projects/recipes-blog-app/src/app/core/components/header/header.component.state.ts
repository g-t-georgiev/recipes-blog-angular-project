import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ComponentStore } from '@ngrx/component-store';

import { ViewportResizeService } from '../../services';


export interface ILocalState {
    showNavigation: boolean,
    showMenuButton: boolean
}

const initialState: ILocalState = {
    showNavigation: true,
    showMenuButton: false
};

@Injectable()
export class HeaderComponentState extends ComponentStore<ILocalState> {

    constructor(
        private readonly vpResizeService: ViewportResizeService, 
    ) {
        super(initialState);
    }

    readonly localState$: Observable<ILocalState> = this.select((state) => state);
    readonly showNavigation$: Observable<boolean> = this.select(({ showNavigation }) => showNavigation);

    readonly updateHeaderState = this.updater(
        (
            state: ILocalState, 
            { 
                showMenuButton, 
                showNavigation 
            }: Pick<ILocalState, 'showNavigation' | 'showMenuButton'>
        ) => ({ 
            ...state, 
            showMenuButton, 
            showNavigation 
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

    readonly toggleBtnClickEffect = this.effect(
        (pointerEv$: Observable<PointerEvent>) => pointerEv$.pipe(
            withLatestFrom(this.showNavigation$),
            tap(([ , showNavigation]) => {
                this.updateHeaderState({ showNavigation: !showNavigation, showMenuButton: true });
            })
        )
    );

    readonly collapseNavigationEffect = this.effect(
        (pointerEv$: Observable<PointerEvent>) => pointerEv$.pipe(
            withLatestFrom(this.showNavigation$),
            tap(([ pointerEv, showNavigation ]) => {

                if (
                    !this.vpResizeService.hasMatch() || 
                    !showNavigation
                ) {
                    return;
                }

                const targetEl = (pointerEv.target as HTMLElement);

                if ([ 
                        'APP-MENU-TOGGLE-BUTTON', 
                        'APP-DARK-MODE-SWITCH', 
                        'BUTTON', 
                        'svg', 
                        'line',
                        'circle', 
                        'rect', 
                        'mask', 
                        'g'
                    ].includes(targetEl.tagName)
                ) { 
                    return; 
                }


                this.updateHeaderState({ showNavigation: false, showMenuButton: true });

            })
        )
    );
    
}