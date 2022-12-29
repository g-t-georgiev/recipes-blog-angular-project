import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, map, mergeMap, Observable, tap } from "rxjs";

import { IRecipesQueryResponse, RecipesService } from "projects/recipes-blog-app/src/app/core/services";
import { IRecipe } from "projects/recipes-blog-app/src/app/shared/interfaces";




export interface ILocalState {
    recipes: Pick<IRecipe, 'title' | '_id' | 'authorId'>[];
    error: boolean;
    loading: boolean;
    page: number;
    limit: number;
    total: number;
    filter: any
}

const initialState: ILocalState = {
    recipes: [],
    error: false,
    loading: false,
    page: 1,
    limit: 3, // 10
    total: 0,
    filter: {}
}

@Injectable()
export class RecipeListComponentState extends ComponentStore<ILocalState> {

    readonly localState$ = this.select(state => state);

    constructor(
        private readonly recipesService: RecipesService
    ) {
        super(initialState);
    }

    readonly updateRecipesState = this.updater((state, recipes: IRecipe[] | []) => ({ ...state, recipes }));
    readonly updateLoadingState = this.updater((state, loading: boolean) => ({ ...state, loading }));
    readonly updateErrorState = this.updater((state, error: boolean ) => ({ ...state, error }));

    readonly updateCurrentPage = this.updater((state, page: number) => ({ ...state, page }));
    readonly updateRecipesLimitPerPage = this.updater((state, limit: number) => ({ ...state, limit }));
    readonly updateRecipesTotalCount = this.updater((state, total: number) => ({ ...state, total }));

    readonly updateFilterState = this.updater((state, filter: any) => ({ ...state, filter }));

    readonly recipesStateChangeEffect = this.effect(
        (result$: Observable<IRecipesQueryResponse>) => result$.pipe(
            tap(({ recipes, message, total}) => {
                this.updateLoadingState(false);
                this.updateRecipesState(recipes);
                this.updateRecipesTotalCount(total);

                console.log(message);
            }),
            catchError((error) => {
                this.updateLoadingState(false);
                this.updateErrorState(true);
                
                console.log(error);
                return EMPTY;
            })
        )
    );

    readonly initializerEffect = this.effect(
        (empty$: Observable<undefined>) => empty$.pipe(
            tap(() => this.updateLoadingState(true)),
            mergeMap(() => this.recipesService.getAll(initialState.page, initialState.limit, initialState.filter).pipe(
                tap(({ recipes, message, total}) => {
                    this.recipesStateChangeEffect({ recipes, message, total });
                })
            ))
        )
    );

    readonly onFiltersChangeEffect = this.effect(
        (filters$: Observable<Partial<Pick<ILocalState, 'page' | 'limit' | 'filter'>>>) => filters$.pipe(
            tap(() => {
                this.updateLoadingState(true);
            }),
            map(({ page, limit, filter }) => {
                page = page ?? initialState.page;
                limit = limit ?? initialState.limit;
                filter = filter ?? initialState.filter;

                this.updateCurrentPage(page);
                this.updateRecipesLimitPerPage(limit);
                this.updateFilterState(filter);
                return { page, limit, filter };
            }),
            mergeMap(({ page, limit, filter }) => {
                return this.recipesService.getAll(page, limit, filter).pipe(
                    tap(({ recipes, message, total }) => {
                        this.recipesStateChangeEffect({ recipes, message, total });
                    }),
                )
            })
        )
    );

}