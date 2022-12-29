import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, map, mergeMap, Observable, tap } from "rxjs";

import { IRecipesQueryResponse, RecipesService } from "projects/recipes-blog-app/src/app/core/services";
import { IRecipe } from "projects/recipes-blog-app/src/app/shared/interfaces";


export interface PageOptions {
    pageIndex: number;
    pageEntriesLimit: number;
    pageQueryFilter: any;
    pageButtonsCount: number;
}

export interface ILocalState {
    loading: boolean;
    error: boolean;
    message?: string;
    recipes: Pick<IRecipe, 'title' | '_id' | 'authorId'>[];
    recipesCount: number;
    pageOptions: PageOptions;
}

const initialState: ILocalState = {
    loading: false,
    error: false,
    recipes: [],
    recipesCount: 0,
    pageOptions: {
        pageIndex: 1,
        pageEntriesLimit: 3, // 10
        pageQueryFilter: {},
        pageButtonsCount: 5
    }
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
    readonly updateRecipesTotalCount = this.updater((state, count: number) => ({ ...state, recipesCount: count }));

    readonly updateLoadingState = this.updater((state, loading: boolean) => ({ ...state, loading }));
    readonly updateErrorState = this.updater((state, error: boolean ) => ({ ...state, error }));

    readonly updateCurrentPage = this.updater((state, page: number) => ({ ...state, pageOptions: { ...state.pageOptions, pageIndex: page } }));
    readonly updateRecipesLimitPerPage = this.updater((state, limit: number) => ({ ...state, pageOptions: { ...state.pageOptions, pageEntriesLimit: limit } }));
    readonly updateFilterState = this.updater((state, filter: any) => ({ ...state, pageOptions: { ...state.pageOptions, pageQueryFilter: filter } }));

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
            mergeMap(() => this.recipesService.getAll(
                    initialState.pageOptions.pageIndex, 
                    initialState.pageOptions.pageEntriesLimit, 
                    initialState.pageOptions.pageQueryFilter
                ).pipe(
                    tap(({ recipes, message, total}) => {
                        this.recipesStateChangeEffect({ recipes, message, total });
                    })
            ))
        )
    );

    readonly onFiltersChangeEffect = this.effect(
        (filters$: Observable<Partial<Pick<PageOptions, 'pageIndex' | 'pageEntriesLimit' | 'pageQueryFilter'>>>) => filters$.pipe(
            tap(() => {
                this.updateLoadingState(true);
            }),
            map(({ pageIndex, pageEntriesLimit, pageQueryFilter }) => {
                pageIndex = pageIndex ?? initialState.pageOptions.pageIndex;
                pageEntriesLimit = pageEntriesLimit ?? initialState.pageOptions.pageEntriesLimit;
                pageQueryFilter = pageQueryFilter ?? initialState.pageOptions.pageQueryFilter;

                this.updateCurrentPage(pageIndex);
                this.updateRecipesLimitPerPage(pageEntriesLimit);
                this.updateFilterState(pageQueryFilter);
                return { pageIndex, pageEntriesLimit, pageQueryFilter };
            }),
            mergeMap(({ pageIndex, pageEntriesLimit, pageQueryFilter }) => {
                return this.recipesService.getAll(pageIndex, pageEntriesLimit, pageQueryFilter).pipe(
                    tap(({ recipes, message, total }) => {
                        this.recipesStateChangeEffect({ recipes, message, total });
                    }),
                )
            })
        )
    );

}