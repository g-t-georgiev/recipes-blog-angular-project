import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, EMPTY } from 'rxjs';
import { tap, mergeMap, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService, IUserSignInDto, IUserSignInResponse } from 'src/app/core/services';

export interface ILocalState {
    message: string | null;
    processing: boolean;
}

const initialState: ILocalState = {
    message: null,
    processing: false
};

let timerId: any = null;

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

    readonly updateMessageState = this.updater((state: ILocalState, message: string | null) => ({ ...state, message }));
    readonly updateProcessingState = this.updater((state: ILocalState, processing: boolean ) => ({ ...state, processing })); 
    
    readonly onLoginEventEffect = this.effect(
        (userData$: Observable<IUserSignInDto>) => {
            return userData$.pipe(
                tap(() => this.updateProcessingState(true)),
                mergeMap((userData) => {
                    return this.authService.login$(userData).pipe(
                        tap(({ message }: IUserSignInResponse) => {
                            this.updateProcessingState(false);
                            this.updateMessageState(message + '\nYou will be redirected after a few seconds...');

                            const redirectUrl = this.activeRoute.snapshot.queryParamMap.get('redirectTo');
                            
                            if (redirectUrl) {
                                timerId = setTimeout(() => {
                                    this.router.navigateByUrl(redirectUrl);
                                    clearTimeout(timerId);
                                }, 2e3);
                            } else {
                                timerId = setTimeout(() => {
                                    this.router.navigate([ '/' ]);
                                    clearTimeout(timerId);
                                }, 2e3);
                            }
                            
                        }),
                        catchError(({ error }) => {
                            
                            // console.log(error);
                            let errorMsg;
        
                            this.updateProcessingState(false);
        
                            if (error.status === 0) {
                                errorMsg = 'Connection error';
                            } else {
                                errorMsg = error.error?.message ?? error?.message ?? error.statusText ?? 'Something went wrong';
                            }

                            this.updateMessageState(errorMsg);

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