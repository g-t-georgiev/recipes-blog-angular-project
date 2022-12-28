import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

import { AuthService, IUserSignUpDto, IUserSignUpResponse } from 'projects/recipes-blog-app/src/app/core/services';


export interface ILocalState {
    message: string | null;
    processing: boolean;
}

const initialState: ILocalState = {
    message: null,
    processing: false
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

    readonly updateMessageState = this.updater((state: ILocalState, message: string | null) => ({ ...state, message }));
    readonly updateProcessingState = this.updater((state: ILocalState, processing: boolean) => ({ ...state, processing }));

    readonly onRegisterEventEffect = this.effect(
        (userData$: Observable<IUserSignUpDto>) => {
            return userData$.pipe(
                tap(() => this.updateProcessingState(true)),
                mergeMap((userData) => {
                    return this.authService.register$(userData).pipe(
                        tap(({ message }: IUserSignUpResponse) => {
                            this.updateProcessingState(false);
                            // this.updateMessageState(message);
                            this.router.navigate([ '/users', 'login' ]);
                        }),
                        catchError((error) => {

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
                    );
                })
            );
        }
    );

}