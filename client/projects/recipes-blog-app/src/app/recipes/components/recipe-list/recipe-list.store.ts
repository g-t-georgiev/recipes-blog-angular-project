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
    recipesCountPerPageFrom(): number;
    recipesCountPerPageTo(): number;
    totalPagesCount(): number;
    pageOptions: PageOptions;
}

const initialRecipesState: RecipesState = {
    loading: false,
    error: false,
    recipes: [],
    recipesCount: 0,
    recipesCountPerPageFrom(): number {
        // console.log(this.pageOptions.pageIndex, this.pageOptions.pageEntriesLimit);
        const fromRange = (this.pageOptions.pageIndex - 1) * this.pageOptions.pageEntriesLimit;
        return this.recipesCount && fromRange + 1;
    },
    recipesCountPerPageTo(): number {
        return (
            this.totalPagesCount() === this.pageOptions.pageIndex
            ? (this.pageOptions.pageEntriesLimit * (this.pageOptions.pageIndex - 1)) + this.recipes.length 
            : this.pageOptions.pageIndex * this.pageOptions.pageEntriesLimit
        );
    },
    totalPagesCount(): number {
        // console.log(this.recipesCount, this.pageOptions.pageEntriesLimit);
        return Math.ceil(this.recipesCount / this.pageOptions.pageEntriesLimit) || 1;
    },
    pageOptions: {
        pageIndex: 1,
        pageEntriesLimit: 3, // 10
        pageQueryFilter: {},
        pageButtonsCount: 5
    }
}

@Injectable()
export class RecipesStore extends ComponentStore<RecipesState> {

    readonly pageQueryParams$ = this.select(
        this.globalStore.select(getMergedRouteState),
        (mergedRoute) => mergedRoute.queryParams,
        { debounce: true }
    );

    readonly pageOptionsData$ = this.select((state) => state.pageOptions);

    constructor(
        private readonly recipesService: RecipesService,
        private readonly globalStore: Store
    ) {
        super(initialRecipesState);

        this.initializePageOptionsState(this.pageQueryParams$);
    }

    readonly updateLoadingState = this.updater((state, loading: boolean) => ({ ...state, loading }));
    readonly updateRecipesState = this.updater((state, { recipes, recipesCount, message }: Pick<RecipesState, 'recipes' | 'recipesCount' | 'message'>) => ({ ...state, recipes, recipesCount, message }));
    readonly updateErrorState = this.updater((state, { error, message }: Pick<RecipesState, 'error' | 'message'>) => ({ ...state, error, message }));
    
    readonly initializePageOptionsState = this.effect(
        (route$: Observable<Params>) => route$.pipe(
            tap({
                next: (queryParams) => {
                    const { page, limit, title } = queryParams;
                    let pageIndex = page && !isNaN(page) ? parseInt(page, 10) : initialRecipesState.pageOptions.pageIndex;
                    let pageEntriesLimit = limit && !isNaN(limit) ? parseInt(limit, 10) : initialRecipesState.pageOptions.pageEntriesLimit;
                    let pageQueryFilter = (
                        title && 
                        typeof title === 'string' && 
                        title.trim().length > 0 
                        ? { title: title.trim() } 
                        : initialRecipesState.pageOptions.pageQueryFilter
                    );

                    this.patchState((state) => ({
                        pageOptions: {
                            ...state.pageOptions,
                            pageIndex,
                            pageEntriesLimit,
                            pageQueryFilter
                        }
                    }));
                }
            })
        )
    );
    readonly fetchRecipes = this.effect(
        (pageOptionsData$: Observable<Pick<PageOptions, 'pageIndex' | 'pageEntriesLimit' | 'pageQueryFilter'>>) => pageOptionsData$.pipe(
            tap(() => {
                this.updateLoadingState(true);
            }),
            switchMap(({ pageIndex, pageEntriesLimit, pageQueryFilter }) => this.recipesService.getAll(pageIndex, pageEntriesLimit, pageQueryFilter).pipe(
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
            ))
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