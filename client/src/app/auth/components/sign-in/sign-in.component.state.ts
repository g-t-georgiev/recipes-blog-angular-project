import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, EMPTY } from 'rxjs';
import { tap, mergeMap, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService, IUserSignInDto } from 'src/app/core/services';

export interface ILocalState {
    message: string | null;
    processing: boolean;
}

const initialState: ILocalState = {
    message: null,
    processing: false
};


@Injectable()
export class SignInComponentState extends ComponentStore<ILocalState> {

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly activeRoute: ActivatedRoute
    ) {
        super(initialState);
    }

    readonly localState$: Observable<ILocalState> = this.select((state) => state);

    readonly updateMessageState = this.updater((state: ILocalState, message: string) => ({ ...state, message }));
    readonly updateProcessingState = this.updater((state: ILocalState, processing: boolean ) => ({ ...state, processing })); 
    
    readonly onLoginEventEffect = this.effect(
        (userData$: Observable<IUserSignInDto>) => {
            return userData$.pipe(
                tap(() => this.updateProcessingState(true)),
                mergeMap((userData) => {
                    return this.authService.login$(userData).pipe(
                        tap(({ message }) => {
                            this.updateProcessingState(false);
                            this.updateMessageState(message);

                            const redirectUrl = this.activeRoute.snapshot.queryParamMap.get('redirectTo');
                            
                            if (redirectUrl) {
                                setTimeout(() => this.router.navigateByUrl(redirectUrl), 2e3);
                            } else {
                                setTimeout(() => this.router.navigate(['/']), 2e3);
                            }
                            
                        }),
                        catchError(({ error }) => {
                            this.updateProcessingState(false);
                            this.updateMessageState(error?.message ?? '#SignInComponent: Something went wrong');

                            // throwing error completes the stream
                            // instead return an empty observable
                            return EMPTY;
                        })
                    )
                })
            );
        }
    );
    
}