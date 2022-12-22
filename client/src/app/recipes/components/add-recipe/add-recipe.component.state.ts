import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, map, mergeMap, Observable, tap } from "rxjs";
import { RecipesService } from "src/app/core/services";
import { IRecipe } from "src/app/shared/interfaces";

export interface ILocalState {
    processing: boolean;
    error: boolean;
    message: string | null;
}

const initialState: ILocalState = {
    processing: false,
    error: false,
    message: null
};

@Injectable()
export class AddRecipeComponentState extends ComponentStore<ILocalState> {

    readonly localState$ = this.select(state => state);

    constructor(
        private readonly recipesService: RecipesService,
        private readonly router: Router
    ) {
        super(initialState);
    }


    readonly updateLoadingState = this.updater((state, processing: boolean) => ({ ...state, processing }));
    readonly updateErrorState = this.updater((state, error: boolean) => ({ ...state, error }));
    readonly updateMessageState = this.updater((state, message: string) => ({ ...state, message }));

    readonly sendCreateRecipeRequestEffect = this.effect(
        (recipeData$: Observable<Pick<IRecipe, 'title' | 'content'>>) => {
            return recipeData$.pipe(
                tap(() => {
                    this.updateLoadingState(true);
                }),
                mergeMap((recipeData) => this.recipesService.create(recipeData).pipe(
                    tap((result) => {
                        this.updateLoadingState(false);
                        this.updateMessageState(result.message);
                        this.updateErrorState(false);

                        console.log(result);
                        this.router.navigate(['/recipes']);

                    }),
                    catchError((error) => {
                        this.updateLoadingState(false);
                        this.updateErrorState(true);
                        this.updateMessageState(error?.message ?? 'Something went wrong');

                        return EMPTY;
                    })
                ))
            );
        }
    );
}