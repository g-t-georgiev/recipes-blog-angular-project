import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

import { AuthService, IUserSignUpDto, IUserSignUpResponse } from 'projects/recipes-blog-app/src/app/core/services';


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
export class SignUpComponentState extends ComponentStore<ILocalState> {

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
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

    readonly updateOnRegisterCompleteState = this.updater(
        (
            state: ILocalState, 
            { processing, message, error }: Pick<ILocalState, 'processing' | 'error' | 'message'>
        ) => ({ 
            ...state, 
            processing, 
            error, 
            message 
        })
    );

    readonly onRegisterEventEffect = this.effect(
        (userData$: Observable<IUserSignUpDto>) => {
            return userData$.pipe(
                tap(() => this.updateProcessingState(true).unsubscribe()),
                mergeMap((userData) => {
                    return this.authService.register$(userData).pipe(
                        tap(({ message }: IUserSignUpResponse) => {

                            this.updateOnRegisterCompleteState({ processing: false, error: false, message }).unsubscribe();
                            this.router.navigate([ '/users', 'login' ]);
                        }),
                        catchError((error) => {

                            // console.log(error);
                            let errorMsg;
        
                            if (error.status === 0) {
                                errorMsg = 'Connection error';
                            } else {
                                errorMsg = error.error?.message ?? error?.message ?? error.statusText ?? 'Something went wrong';
                            }
        
                            this.updateOnRegisterCompleteState({ processing: false, error: true, message: errorMsg }).unsubscribe();
                            return EMPTY;
                        })
                    );
                })
            );
        }
    );

}