import { Injectable } from "@angular/core";
import { Store} from "@ngrx/store";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, map, mergeMap, Observable, switchMap, tap } from "rxjs";

import { getMergedRouteState } from "../../../state/router/selectors";

import { IRecipesQueryResponse, RecipesService } from "projects/recipes-blog-app/src/app/core/services";
import { IRecipe } from "projects/recipes-blog-app/src/app/shared/interfaces";


export interface PageOptions {
    pageIndex: number;
    pageEntriesLimit: number;
    pageQueryFilter: any;
    pageButtonsCount?: number;
}

export interface ILocalState {
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

const initialState: ILocalState = {
    loading: false,
    error: false,
    recipes: [],
    recipesCount: 0,
    recipesCountPerPageFrom(): number {
        // console.log(this.pageOptions.pageIndex, this.pageOptions.pageEntriesLimit);
        const fromRange = (this.pageOptions.pageIndex - 1) * this.pageOptions.pageEntriesLimit;
        return fromRange + 1;
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
        return Math.ceil(this.recipesCount / this.pageOptions.pageEntriesLimit);
    },
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
        private readonly recipesService: RecipesService,
        private readonly globalState: Store
    ) {
        super(initialState);
    }


    readonly updateLoadingState = this.updater((state, loading: boolean) => ({ ...state, loading }));
    readonly updateLoadedState = this.updater((state, options: Pick<ILocalState, 'loading' | 'error' | 'message' | 'recipes' | 'recipesCount'>) => ({ ...state, ...options }));
    readonly updatePageOptionsState = this.updater((state, options: Omit<PageOptions, 'pageButtonsCount'>) => ({ ...state, pageOptions: { ...options }}));

    readonly initializerEffect = this.effect(
        (empty$: Observable<undefined>) => empty$.pipe(
            tap(() => {
                this.updateLoadingState(true);
            }),
            switchMap(() => this.globalState.select(getMergedRouteState)),
            map(mergedRoute => {

                let queryParams: any = mergedRoute.queryParams;
                let pageIndex = queryParams.page && !isNaN(queryParams.page) ? parseInt(queryParams.page, 10) : initialState.pageOptions.pageIndex;
                let pageEntriesLimit = queryParams.limit && !isNaN(queryParams.limit) ? parseInt(queryParams.limit, 10) : initialState.pageOptions.pageEntriesLimit;
                let pageQueryFilter = (
                    queryParams.title && 
                    typeof queryParams.title === 'string' && 
                    queryParams.title.trim().length > 0 
                    ? { title: queryParams.title.trim() } 
                    : initialState.pageOptions.pageQueryFilter
                );

                this.updatePageOptionsState({ pageIndex, pageEntriesLimit, pageQueryFilter });

                return { pageIndex, pageEntriesLimit, pageQueryFilter };
            }),
            mergeMap(({ pageIndex, pageEntriesLimit, pageQueryFilter }) => {
                return this.recipesService.getAll(pageIndex, pageEntriesLimit, pageQueryFilter).pipe(
                    tap(({ recipes, message, total }) => {
                        this.recipesLoadingSuccessEffect({ recipes, message, total });
                    }),
                    catchError(error => {
                        this.recipesLoadingErrorEffect(error);
                        return EMPTY;
                    })
                )
            })
        )
    );

    readonly recipesLoadingSuccessEffect = this.effect(
        (result$: Observable<IRecipesQueryResponse>) => result$.pipe(
            tap(({ recipes, message, total}) => {
                console.log(message);
                this.updateLoadedState({ loading: false, error: false, message:message, recipes, recipesCount: total });
            }),
            catchError((error) => {
                console.log(error);
                return EMPTY;
            })
        )
    );

    readonly recipesLoadingErrorEffect = this.effect(
        (error$: Observable<any>) => error$.pipe(
            tap(error => {
                console.log(error);
                this.updateLoadedState({ loading: false, error: true, message: error.message, recipes: [], recipesCount: 0 });
            }),
            catchError((error) => {                
                console.log(error);
                return EMPTY;
            })
        )
    );

}