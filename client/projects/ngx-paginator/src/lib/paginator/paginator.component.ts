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

	@Input() set pageIndex(value: string | number) {
		this.paginatorStore.setPageIndex(value);
	}

	@Input() set length(value: string | number) {
		this.paginatorStore.setLength(value);
	}

	@Input() set pageLength(value: string | number) {
		this.paginatorStore.setPageLength(value);
	}

	@Input() set pageSize(value: string | number) {
		this.paginatorStore.setPageSize(value);
	}

	@Input() set pageSizeOptions(value: readonly number[]) {
		this.paginatorStore.setPageSizeOptions(value);
	}

	// Outputing the event directly from the page$ Observable<PageEvent> property.
	/** Event emitted when the paginator changes the page size or page index. */
	@Output() readonly page = this.paginatorStore.page$;

	// ViewModel for the PaginatorComponent
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