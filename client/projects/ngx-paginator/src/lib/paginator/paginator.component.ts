import { CommonModule } from '@angular/common';

import {
	Component,
	ChangeDetectionStrategy,
	Input,
	Output, 
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { PaginatorStore } from './paginator.store';

@Component({
	standalone: true,
	selector: 'ngx-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, FormsModule],
	providers: [PaginatorStore]
})
export class PaginatorComponent {

	private _pageIndex!: string | number;
	private _pageSize!: string | number;
	private _length!: string | number;
	private _pageLength!: string | number;

	@Input() 
	get pageIndex() {
		return this._pageIndex;
	}
	set pageIndex(newPageIndex: string | number) {
		const currentPageIndex = this._pageIndex;

		if (newPageIndex != currentPageIndex) {
			this.paginatorStore.setPageIndex(newPageIndex);
			this._pageIndex = newPageIndex;
		}
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
	set pageSize(newPageSize: string | number) {
		const currentPageSize = this._pageSize;

		if (newPageSize != currentPageSize) {
			this.paginatorStore.setPageSize(newPageSize);
			this._pageSize = newPageSize;
		}
	}

	@Input() set pageSizeOptions(value: readonly number[]) {
		this.paginatorStore.setPageSizeOptions(value);
	}

	/** Event emitted when the paginator changes the page size or page index. */
	@Output() readonly page = this.paginatorStore.page$;

	readonly vm$ = this.paginatorStore.vm$;

	constructor(private readonly paginatorStore: PaginatorStore) { }

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