import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Params } from "@angular/router";
import { Store} from "@ngrx/store";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, Observable, switchMap, tap } from "rxjs";

import { getMergedRouteState, RouterActions, RouterPayload } from "projects/recipes-blog-app/src/app/+router-store";

import { IRecipesQueryResponse, RecipesService } from "projects/recipes-blog-app/src/app/core/services";
import { IRecipe } from "projects/recipes-blog-app/src/app/shared/interfaces";



export interface PageOptions {
    pageIndex: number;
    pageEntriesLimit: number;
    pageQueryFilter: any;
    pageButtonsCount?: number;
}

export interface RecipesState {
    loading: boolean;
    error: boolean;
    message?: string;
    recipes: Pick<IRecipe, 'title' | '_id' | 'authorId'>[];
    recipesCount: number;
    pageSizeOptions: ReadonlyArray<number>;
}

const initialRecipesState: RecipesState = {
    loading: false,
    error: false,
    recipes: [],
    recipesCount: 0, 
    pageSizeOptions: [ 1, 3, 5, 10, 15 ]
}

@Injectable()
export class RecipesStore extends ComponentStore<RecipesState> {

    readonly pageQueryParams$ = this.select(
        this.globalStore.select(getMergedRouteState),
        (route) => route.queryParams,
        { debounce: true }
    );

    constructor(
        private readonly recipesService: RecipesService,
        private readonly globalStore: Store
    ) {

        super(initialRecipesState);

        this.fetchRecipes(this.pageQueryParams$);
    }

    readonly updateLoadingState = this.updater((state, loading: boolean) => ({ ...state, loading }));
    readonly updateRecipesState = this.updater((state, { recipes, recipesCount, message }: Pick<RecipesState, 'recipes' | 'recipesCount' | 'message'>) => ({ ...state, recipes, recipesCount, message }));
    readonly updateErrorState = this.updater((state, { error, message }: Pick<RecipesState, 'error' | 'message'>) => ({ ...state, error, message }));
    

    readonly fetchRecipes = this.effect(
        (pageQueryOptions$: Observable<any>) => pageQueryOptions$.pipe(
            tap(() => {
                this.updateLoadingState(true);
            }),
            switchMap(({ page, limit }) => {

                page = Number(page);
                page = isNaN(page) || page < 1 ? 1 : page;

                limit = Number(limit);
                limit = isNaN(limit) || limit < 1 ? 1 : limit;

                return this.recipesService.getAll(page, limit).pipe(
                    tap({
                        next: ({ recipes, message, total}) => {
                            this.addRecipes({ recipes, message, total })
                        },
                        error: (error: HttpErrorResponse) => {
                            this.logError(error);
                        }
                    }),
                    catchError((error) => {
                        console.log(error);
                        return EMPTY;
                    })
                )
            })
        )
    );

    readonly addRecipes = this.effect(
        (result$: Observable<IRecipesQueryResponse>) => result$.pipe(
            tap(({ recipes, message, total}) => {
                console.log(message);
                this.updateLoadingState(false);
                this.updateRecipesState({ recipes, recipesCount: total, message });
            })
        )
    );

    readonly logError = this.effect(
        (error$: Observable<HttpErrorResponse>) => error$.pipe(
            tap(error => {

                console.log(error);
                let errorMsg;
        
                if (error.status === 0) {
                    errorMsg = 'Connection error';
                } else {
                    errorMsg = error.error?.message ?? error?.message ?? error.statusText ?? 'Something went wrong';
                }

                this.updateLoadingState(false);
                this.updateErrorState({ error: true, message: errorMsg });
            })
        )
    );

    readonly navigate = this.effect(
        (payload$: Observable<RouterPayload>) => payload$.pipe(
            tap((payload) => {
                this.globalStore.dispatch(RouterActions.go(payload));
            })
        )
    );

}