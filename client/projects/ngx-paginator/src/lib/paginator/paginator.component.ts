import { CommonModule } from '@angular/common';

import {
	Component,
	ChangeDetectionStrategy,
	Input,
	Output,
	forwardRef, 
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { filter, tap } from 'rxjs';

import { PaginatorStore } from './paginator.store';

@Component({
	standalone: true,
	selector: 'ngx-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, FormsModule],
	providers: [
		PaginatorStore, 
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PaginatorComponent),
			multi: true
		}
	]
})
export class PaginatorComponent implements ControlValueAccessor {

	private _pageIndex!: string | number;
	private _pageSize!: string | number;
	private _length!: string | number;
	private _pageLength!: string | number;

	@Input() 
	get pageIndex() {
		return this._pageIndex;
	}
	set pageIndex(value: string | number) {
		this._pageIndex = value;
		this.paginatorStore.setPageIndex(value);
	}

	@Input() 
	get length() {
		return this._length;
	}
	set length(value: string | number) {
		this._length = value;
		this.paginatorStore.setLength(value);
	}

	@Input() 
	get pageLength() {
		return this._pageLength;
	}
	set pageLength(value: string | number) {
		this._pageLength = value;
		this.paginatorStore.setPageLength(value);
	}

	@Input() 
	get pageSize() {
		return this._pageSize;
	}
	set pageSize(value: string | number) {
		this._pageSize = value;
		this.paginatorStore.setPageSize(value);
	}

	@Input() set pageSizeOptions(value: readonly number[]) {
		this.paginatorStore.setPageSizeOptions(value);
	}

	/** Event emitted when the paginator changes the page size or page index. */
	@Output() readonly page = this.paginatorStore.page$.pipe(
		filter((page) => {
			return (
				page.pageIndex != this.pageIndex || 
				page.pageSize != this.pageSize
			);
		}),
		tap((page) => {
			this._onChangeCallback(page);
			this._onTouchedCallback(true);
		})
	);

	readonly vm$ = this.paginatorStore.vm$;

	constructor(private readonly paginatorStore: PaginatorStore) { }

	// Form-API related logic

	private _onChangeCallback: any;
	private _onTouchedCallback: any;

	writeValue(value: any): void {
		if (!value) return;
		
		this.changePageIndex(value.page);
		this.changePageSize(value.size);
	}

	registerOnChange(fn: any): void {
		this._onChangeCallback = fn;
	}

	registerOnTouched(fn: any): void {
		this._onTouchedCallback = fn;
	}

	// Pagination-related logic

	changePageSize(newPageSize: number | string) {
		this.paginatorStore.changePageSize(newPageSize);
	}

	changePageIndex(newPageIndex: number | string) {
		this.paginatorStore.setPageIndex(newPageIndex);
	}

	nextPage() {
		this.paginatorStore.nextPage();
	}

	firstPage() {
		this.paginatorStore.firstPage();
	}
	
	previousPage() {
		this.paginatorStore.previousPage();
	}

	lastPage() {
		this.paginatorStore.lastPage();
	}

}