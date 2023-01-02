import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, mergeMap, tap } from 'rxjs/operators';

import { UsersService } from 'projects/recipes-blog-app/src/app/core/services';

import { IUser } from 'projects/recipes-blog-app/src/app/shared/interfaces';

import { IRootState, currentUser as currentUserStore } from 'projects/recipes-blog-app/src/app/+store';


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

    readonly localState$: Observable<ILocalState> = this.select(state => ({ ...state }));

    readonly currentUser$: Observable<IUser | null | undefined> = this.select(state => state.currentUser);
    readonly isLoading$: Observable<boolean> = this.select(state => state.processing);
    readonly errorHappened$: Observable<boolean> = this.select(state => state.error);
    readonly isInEditMode$: Observable<boolean> = this.select(state => state.inEditMode);
    readonly message$: Observable<string> = this.select(state => state.message);

    constructor(
        private readonly usersService: UsersService, 
        private readonly globalState: Store<IRootState>
    ) {
        super(initialState);
    }

    readonly updateLoadingStatus = this.updater((state, processing: boolean) => ({ ...state, processing }));
    readonly updateEditModeStatus = this.updater((state) => ({ ...state, inEditMode: !state.inEditMode }));

    readonly updateErrorState = this.updater((state, { processing, error, message, user }: { processing: boolean, error: boolean, message: string, user: undefined  }) => ({ ...state, processing, error, message, currentUser: user }));
    readonly updateSuccessState = this.updater((state, { processing, user, message, error }: {  processing: boolean, user: IUser, message: string, error: boolean }) => ({ ...state, processing, currentUser: user, message, error }));
    
    readonly loadProfileEffect = this.effect(
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

    readonly editProfileEffect = this.effect(
        (userData$: Observable<{ username: string, email: string, profilePicture?: File }>) => {
            return userData$.pipe(
                tap(() => {
                    this.updateLoadingStatus(true);
                }),
                mergeMap((userData) => {
                    return this.usersService.editProfile(userData).pipe(
                        tap(({ user, message }) => {

                            if (user) {
                                this.updateSuccessState({ processing: false, user, message, error: false });
                                this.globalState.dispatch(currentUserStore.actions.login({ user }));
                                this.updateEditModeStatus();
                            }

                        }),
                        catchError((error) => {
                            this.updateErrorState({ processing: false, error: true, message: error.message, user: undefined });
                            return EMPTY;
                        })
                    );
                })
            );
        }
    );

}