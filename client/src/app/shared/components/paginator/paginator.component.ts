import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'app-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnChanges {

	@Input('current') currentPage: number = 0;
	@Input('total') totalPagesCount: number = 0;

	@Output() goTo: EventEmitter<number> = new EventEmitter<number>();
	@Output() next: EventEmitter<number> = new EventEmitter<number>();
	@Output() previous: EventEmitter<number> = new EventEmitter<number>();

	pages: number[] = [];

	ngOnChanges(changes: SimpleChanges): void {
		if (
			(changes['current'] && changes['current'].currentValue) || 
			(changes['total'] && changes['total'].currentValue)
		) {
			this.pages = this.getPages(this.currentPage, this.totalPagesCount);
		}
	}

	getPages(current: number, total: number): number[] {

		if (total <= 7) {
			return [...Array(total).keys()].map(i => ++i);
		}
		
		return [];
	}

	onGoTo(page: number): void {
		this.goTo.emit(page);
	}

	onNext(): void {
		this.next.emit(this.currentPage);
	}

	onPrevious(): void {
		this.previous.emit(this.currentPage);
	}

}
