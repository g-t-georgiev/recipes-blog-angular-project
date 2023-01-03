import { Inject, Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs";

import { RouterActions } from './router.actions';

@Injectable()
export class RouterEffects {

    constructor(
        private readonly actions$: Actions,
        private readonly router: Router, 
        private readonly route: ActivatedRoute, 
    ) { }

    readonly navigate$ = createEffect(() => this.actions$.pipe(
        ofType(RouterActions.go), 
        tap(({ payload: { path, query, relativeToCurrentRoute, extras } }) => {
            let options = {} as any;

            if (query) {
                options.queryParams = { ...query };
            }

            if (extras) {
                options = { ...options, ...extras };
            }

            if (relativeToCurrentRoute) {
                options = { ...options, relativeTo: this.route };
            }

            this.router.navigate(path, { ...options });
        })
    ), { dispatch: false });

}