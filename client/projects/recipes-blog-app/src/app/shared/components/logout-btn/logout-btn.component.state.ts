import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, mergeMap, Observable, tap } from "rxjs";
import { AuthService, IUserSignOutResponse } from "../../../core/services/auth.service";

export interface ILocalState {
    signingOut: boolean;
}

const initialState: ILocalState = {
    signingOut: false
}

@Injectable()
export class LogoutBtnComponentState extends ComponentStore<ILocalState> {

    readonly signingOut$: Observable<boolean> = this.select(({ signingOut }) => signingOut);

    constructor(
        private readonly router: Router,
        private readonly authService: AuthService
    ) {
        super(initialState);
    }

    readonly updateSignoutStatus = this.updater(
        (
            state: ILocalState, 
            signingOut: boolean
        ) => ({ 
            ...state, 
            signingOut 
        })
    );

    readonly onLogoutSuccessEffect = this.effect(
        (response$: Observable<IUserSignOutResponse>) => response$.pipe(
            tap(({ message }) => {
                console.log(message);
                this.updateSignoutStatus(false).unsubscribe();
                this.router.navigate(['/users', 'login']);
            })
        )
    );

    readonly onLogoutFailEffect = this.effect(
        (error$: Observable<HttpErrorResponse>) => error$.pipe(
            tap((error) => {

                this.updateSignoutStatus(false).unsubscribe();
                let errorMsg;

                if (error.status === 0) {
                    errorMsg = 'Connection error';
                } else {
                    errorMsg = error.error?.message ?? error?.message ?? error.statusText ?? 'Something went wrong';
                }

                console.log(errorMsg);
            })
        )
    );

    readonly logoutInitEffect = this.effect(
        (pointerEv$: Observable<PointerEvent>) => {
            return pointerEv$.pipe(
                tap(() => {
                    this.updateSignoutStatus(true).unsubscribe();
                }),
                mergeMap(() => this.authService.logout$().pipe(
                        tap(this.onLogoutSuccessEffect),
                        catchError((error) => {
                            this.onLogoutFailEffect(error);
                            return EMPTY;
                        })
                    )
                )
            );
        }
    );

}