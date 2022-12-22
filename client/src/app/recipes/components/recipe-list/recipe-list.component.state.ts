import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, map, mergeMap, Observable, tap } from "rxjs";

import { RecipesService } from "src/app/core/services";
import { IRecipe } from "src/app/shared/interfaces";


export interface ILocalState {
    recipes: Pick<IRecipe, 'title' | '_id' | 'authorId'>[];
    error: boolean;
    loading: boolean;
    page: number;
    limit: number;
    total: number;
}

const initialState: ILocalState = {
    recipes: [],
    error: false,
    loading: false,
    page: 1,
    limit: 10,
    total: Infinity
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
    readonly updateRecipeLimitPerPage = this.updater((state, limit: number) => ({ ...state, limit }));
    readonly updateRecipesTotalCount = this.updater((state, total: number) => ({ ...state, total }));

    readonly queryParamsChangeEffect = this.effect(
        (queryParams$: Observable<{ [key: string]: string }>) => {

            return queryParams$.pipe(
                mergeMap((params) => {

                    let { page, size, ...filters } = params;

                    this.updateCurrentPage(+page);
                    this.updateRecipeLimitPerPage(+size);

                    return this.recipesService.getAll(+page, +size, filters).pipe(
                        tap(() => {
                            this.updateLoadingState(true);
                        }),
                        map(({ recipes, message, total}) => {

                            this.updateLoadingState(false);
                            this.updateRecipesState(recipes);
                            this.updateRecipesTotalCount(total);
                            this.updateErrorState(false);

                            console.log(message);

                            return { recipes, message, total };
                        }),
                        catchError((error) => {

                            this.updateLoadingState(false);
                            this.updateErrorState(true);
                            this.updateRecipesState([]);

                            console.log(error?.message ?? 'Something went wrong');

                            return EMPTY;
                        })
                    );
                })
            );
        }
    );

}