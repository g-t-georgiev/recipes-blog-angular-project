import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { UsersService } from 'src/app/core/services';
import { IUser } from 'src/app/shared/interfaces';


interface ILocalState {
    message: string;
    error: boolean;
    processing: boolean;
    inEditMode: boolean;
    currentUser: IUser | undefined;
}

const initialState: ILocalState = {
    message: '',
    error: false,
    processing: false,
    inEditMode: false,
    currentUser: undefined
}

@Injectable()
export class ProfileDetailsState extends ComponentStore<ILocalState> {

    readonly currentUserDetails$: Observable<IUser | null | undefined> = this.select(state => state.currentUser);
    readonly isLoading$: Observable<boolean> = this.select(state => state.processing);
    readonly errorHappened$: Observable<boolean> = this.select(state => state.error);
    readonly isInEditMode$: Observable<boolean> = this.select(state => state.inEditMode);
    readonly message$: Observable<string> = this.select(state => state.message);

    constructor(
        private readonly usersService: UsersService
    ) {
        super(initialState);
    }

    readonly updateLoadingStatus = this.updater((state, processing: boolean) => ({ ...state, processing }));
    readonly updateProfileDetails = this.updater((state, currentUser: IUser | undefined) => ({ ...state, currentUser }));
    readonly updateErrorState = this.updater((state, { processing, error, message, user }: { processing: boolean, error: boolean, message: string, user: undefined  }) => ({ ...state, processing, error, message, currentUser: user }));
    readonly updateSuccessState = this.updater((state, { processing, user, message, error }: {  processing: boolean, user: IUser, message: string, error: boolean }) => ({ ...state, processing, currentUser: user, message, error }));
    readonly loadProfileDetails = this.effect(
        (empty$: Observable<undefined>) => {
            return empty$.pipe(
                tap(() => {
                    this.updateLoadingStatus(true);
                }),
                switchMap(() => {
                    return this.usersService.loadProfileDetails().pipe(
                        tap(({ user, message }) => {

                            if (user) {
                                this.updateSuccessState({ processing: false, user, message, error: false  });
                            }

                            
                        }),
                        catchError((error) => {
                            this.updateErrorState({ processing: false, error: true, message: error.message, user: undefined });
                            return EMPTY;
                        })
                    )
                })
            )
        }
    )

}