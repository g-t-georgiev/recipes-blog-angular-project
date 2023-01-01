import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, EMPTY } from 'rxjs';
import { tap, mergeMap, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService, IUserSignInDto, IUserSignInResponse } from 'projects/recipes-blog-app/src/app/core/services';

export interface ILocalState {
    message: string | null;
    processing: boolean;
    error: boolean;
}

const initialState: ILocalState = {
    message: null,
    processing: false,
    error: false
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

    readonly updateProcessingState = this.updater(
        (
            state: ILocalState, 
            processing: boolean
        ) => ({ 
            ...state, 
            processing 
        })
    ); 

    readonly updateOnLoginCompleteState = this.updater(
        (
            state, 
            { 
                processing, 
                message, 
                error 
            }: Pick<ILocalState, 'processing' | 'error' | 'message'>
        ) => ({ 
            ...state, 
            processing, 
            message, 
            error 
        })
    );

    readonly onLoginEventEffect = this.effect(
        (userData$: Observable<IUserSignInDto>) => {
            return userData$.pipe(
                tap(() => this.updateProcessingState(true).unsubscribe()),
                mergeMap((userData) => {
                    return this.authService.login$(userData).pipe(
                        tap(({ message }: IUserSignInResponse) => {

                            this.updateOnLoginCompleteState({ processing: false, message, error: false }).unsubscribe();

                            const redirectUrl = this.activeRoute.snapshot.queryParamMap.get('redirectTo');
                            
                            if (redirectUrl) {
                                this.router.navigateByUrl(redirectUrl);
                            } else {
                                this.router.navigate([ '/' ]);
                            }
                            
                        }),
                        catchError((error) => {
                            
                            // console.log(error);
                            let errorMsg;
        
                            if (error.status === 0) {
                                errorMsg = 'Connection error';
                            } else {
                                errorMsg = error.error?.message ?? error?.message ?? error.statusText ?? 'Something went wrong';
                            }

                            this.updateOnLoginCompleteState({ processing: false, message: errorMsg, error: true }).unsubscribe();
                            return EMPTY;
                        })
                    )
                })
            );
        }
    );
    
}