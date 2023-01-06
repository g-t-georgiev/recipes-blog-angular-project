import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { filter, map, pairwise, tap, withLatestFrom } from "rxjs/operators";

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

    readonly setPageIndex = this.updater((state, value: number | string) => ({
        ...state,
        pageIndex: Number(value)
    }));

    readonly setPageSize = this.updater((state, value: number | string) => ({
        ...state,
        pageSize: Number(value)
    }));

    readonly setLength = this.updater((state, value: number | string) => ({
        ...state,
        length: Number(value)
    }));

    readonly setPageLength = this.updater((state, value: number | string) => ({
        ...state,
        pageLength: Number(value)
    }));

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
            const startIndex = ((state.pageIndex - 1) * state.pageSize) + 1;
            // TODO: Fix pageIndex recalculation on pageSize changes
            return {
                ...state,
                pageSize: Number(newPageSize),
                pageIndex: Math.ceil(startIndex / Number(newPageSize)) || 1
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

    private readonly pageIndexOptions$ = this.select(
        this.numberOfPages$,
        (numberOfPages) => {
            const pages = [ ...Array<number>(numberOfPages).keys() ].map((i) => ++i);
            // console.log(pages);
            return pages;
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
        this.pageIndexOptions$,
        this.hasPreviousPage$,
        this.hasNextPage$,
        this.rangeLabel$,
        (state, pageIndexOptions, hasPreviousPage, hasNextPage, rangeLabel) => ({
            pageSize: state.pageSize,
            pageSizeOptions: Array.from(state.pageSizeOptions), 
            pageIndex: state.pageIndex, 
            pageIndexOptions, 
            hasPreviousPage,
            hasNextPage,
            rangeLabel,
        })
    );

    private readonly pageIndexChanges$ = this.state$.pipe(
        map((state) => state.pageIndex),
        pairwise()
    );

    readonly page$: Observable<PageEvent> = this.select(
        this.pageIndexChanges$,
        this.select((state) => [state.pageSize, state.length]),
        ([previousPageIndex, pageIndex], [pageSize, length]) => ({
            pageIndex,
            previousPageIndex,
            pageSize,
            length,
        }),
        { debounce: true }
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