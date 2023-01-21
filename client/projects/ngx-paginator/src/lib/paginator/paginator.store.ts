import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { filter, map, pairwise, skip, startWith, tap, withLatestFrom } from "rxjs/operators";

export interface PaginatorState {
    pageIndex: number;
    pageSize: number;
    pageSizeOptions: ReadonlySet<number>;
    length: number;
    pageLength: number;
}

export interface PageEvent extends Pick<PaginatorState, 'pageIndex' | 'pageSize' | 'length'> {
    previousPageIndex?: number;
}

@Injectable()
export class PaginatorStore extends ComponentStore<PaginatorState> {

    constructor() {
        // Set default state
        super({
            pageIndex: 1,
            pageSize: 3,
            pageSizeOptions: new Set<number>([10]),
            length: 0,
            pageLength: 0
        });
    }

    // Updaters 

    readonly setPageIndex = this.updater((state, newPageIndex: number | string) => {
        if (state.pageIndex == newPageIndex) {
            return state;
        }

        newPageIndex = Number(newPageIndex);
        newPageIndex = isNaN(newPageIndex) || newPageIndex < 1 ? 1 : newPageIndex;

        const numberOfPages = Math.ceil(state.length / state.pageSize);
        newPageIndex = newPageIndex > numberOfPages ? 1 : newPageIndex;

        return {
            ...state,
            pageIndex: newPageIndex
        };
    });

    readonly setPageSize = this.updater((state, newPageSize: number | string) => {
        if (state.pageSize == newPageSize) {
            return state;
        }

        newPageSize = Number(newPageSize);
        newPageSize = isNaN(newPageSize) || newPageSize < 1 ? 1 : newPageSize;

        const startIndex: number = ((state.pageIndex - 1) * state.pageSize) + 1;
        const newPageIndex: number = Math.ceil(startIndex / newPageSize);

        return {
            ...state,
            pageSize: newPageSize,
            ...(state.pageIndex != newPageIndex ? { pageIndex: newPageIndex } : {})
        };
    });

    readonly setLength = this.updater((state, newLength: number | string) => {
        if (state.length == newLength) {
            return state;
        }

        newLength = Number(newLength);
        newLength = isNaN(newLength) || newLength < 0 ? 0 : newLength;

        return {
            ...state,
            length: newLength
        };
    });

    readonly setPageLength = this.updater((state, newPageLength: number | string) => {
        if (state.pageLength == newPageLength) {
            return state;
        }

        newPageLength = Number(newPageLength);
        newPageLength = isNaN(newPageLength) || newPageLength < 0 ? 0 : newPageLength;

        return {
            ...state,
            pageLength: newPageLength
        };
    });

    readonly setPageSizeOptions = this.updater(
        (state, value: readonly number[]) => {
            // Making sure that the pageSize is included and sorted
            const pageSizeOptions = new Set<number>(
                [...value, state.pageSize].sort((a, b) => a - b)
            );
            return { ...state, pageSizeOptions };
        }
    );

    readonly changePageSize = this.updater(
        (state, newPageSize: number | string) => {
            
            newPageSize = Number(newPageSize);
            newPageSize = isNaN(newPageSize) || newPageSize < 1 ? 1 : newPageSize;
            const startIndex: number = ((state.pageIndex - 1) * state.pageSize) + 1;
            const newPageIndex: number = Math.ceil(startIndex / newPageSize) || 1;

            return {
                ...state,
                pageSize: newPageSize,
                ...(state.pageIndex != newPageIndex ? { pageIndex: newPageIndex } : {})
            }
        }
    );

    // Selectors 

    readonly hasPreviousPage$ = this.select(
        ({ pageIndex, pageSize }) => pageIndex > 1 && pageSize != 0
    );

    readonly numberOfPages$ = this.select(
        ({ pageSize, length }) => {
            if (!pageSize) return 1;

            return Math.ceil(length / pageSize);
        }
    );

    readonly hasNextPage$ = this.select(
        this.state$,
        this.numberOfPages$,
        ({ pageIndex, pageSize }, numberOfPages) => {
            const maxPageIndex = numberOfPages;
            return pageIndex < maxPageIndex && pageSize != 0;
        }
    );

    readonly rangeLabel$ = this.select(
        this.state$,
        this.numberOfPages$,
        ({ pageIndex, pageSize, length, pageLength }, numberOfPages) => {
            length = Math.max(length, 0);
            const startIndex = length && ((pageIndex - 1) * pageSize) + 1;
            const endIndex = pageIndex == numberOfPages 
            ? (pageSize * (pageIndex - 1)) + pageLength
            : pageIndex * pageSize;

            if (startIndex == endIndex) return `${endIndex} of ${length}`;

            return `${startIndex} - ${endIndex} of ${length}`;
        }
    );

    readonly vm$ = this.select(
        this.state$,
        this.numberOfPages$,
        this.hasPreviousPage$,
        this.hasNextPage$,
        this.rangeLabel$,
        (state, numberOfPages, hasPreviousPage, hasNextPage, rangeLabel) => ({
            pageSize: state.pageSize,
            pageSizeOptions: Array.from(state.pageSizeOptions), 
            pageIndex: state.pageIndex, 
            numberOfPages, 
            hasPreviousPage,
            hasNextPage,
            rangeLabel,
        })
    );

    private readonly pageIndexChanges$ = this.select((state) => state.pageIndex).pipe(
        startWith(this.get().pageIndex),
        pairwise(),
        map(([prev, curr]) => ({ previousPageIndex: prev, pageIndex: curr }))
    );

    private readonly pageSizeChanges$ = this.select((state) => state.pageSize);

    private readonly lengthChanges$ = this.select((state) => state.length);

    readonly page$: Observable<PageEvent> = this.select(
        this.pageIndexChanges$,
        this.pageSizeChanges$,
        this.lengthChanges$,
        ({ previousPageIndex, pageIndex }, pageSize, length) => ({
            pageIndex,
            previousPageIndex,
            pageSize,
            length,
        }),
        { debounce: true }
    ).pipe(
        skip(1)
    );

    // Effects

    readonly nextPage = this.effect((trigger$) => {
        return trigger$.pipe(
            withLatestFrom(this.hasNextPage$),
            filter(([, hasNextPage]) => hasNextPage),
            tap(() => {
                this.setPageIndex(this.get().pageIndex + 1);
            })
        );
    });

    readonly firstPage = this.effect((trigger$) => {
        return trigger$.pipe(
            withLatestFrom(this.hasPreviousPage$),
            filter(([, hasPreviousPage]) => hasPreviousPage),
            tap(() => {
                this.setPageIndex(1);
            })
        );
    });

    readonly previousPage = this.effect((trigger$) => {
        return trigger$.pipe(
            withLatestFrom(this.hasPreviousPage$),
            filter(([, hasPreviousPage]) => hasPreviousPage),
            tap(() => {
                this.setPageIndex(this.get().pageIndex - 1);
            })
        );
    });

    readonly lastPage = this.effect((trigger$) => {
        return trigger$.pipe(
            withLatestFrom(this.hasNextPage$, this.numberOfPages$),
            filter(([, hasNextPage]) => hasNextPage),
            tap(([, , numberOfPages]) => {
                this.setPageIndex(numberOfPages);
            })
        );
    });
}