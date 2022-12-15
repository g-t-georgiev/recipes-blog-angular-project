import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

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

    constructor() {
        super(initialState);
    }

    readonly localState$: Observable<ILocalState> = this.select((state) => state);

    readonly updateMessageState = this.updater((state: ILocalState, message: string) => ({ ...state, message }));
    readonly updateProcessingState = this.updater((state: ILocalState, processing: boolean ) => ({ ...state, processing }));    
    
}