import { 
	Component, 
	OnInit, 
	OnChanges, 
	SimpleChanges, 
	Input, 
	Output, 
	EventEmitter, 
} from '@angular/core';

@Component({
	selector: 'ngx-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {

	@Input('current') currentPage: number = 0;
	@Input('total') totalPagesCount: number = 0;

	@Output() goTo: EventEmitter<number> = new EventEmitter<number>();
	@Output() next: EventEmitter<number> = new EventEmitter<number>();
	@Output() previous: EventEmitter<number> = new EventEmitter<number>();

	pages: number[] = [];

	ngOnInit() {

		// console.log(this.currentPage, this.totalPagesCount);
		
		if (
			this.currentPage && 
			this.totalPagesCount
		) {
			this.pages = this.getPages(this.currentPage, this.totalPagesCount);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {

		if (
			(changes['current'] && changes['current'].currentValue) || 
			(changes['total'] && changes['total'].currentValue)
		) {
			// console.log(changes['current'].currentValue, changes['total'].currentValue);
			this.pages = this.getPages(this.currentPage, this.totalPagesCount);
		}
	}

	getPages(current: number, total: number): number[] {

		if (total <= 7) {
			return [...Array(total).keys()].map(i => ++i);
		}

		if (current > 5) {

			if (current >= total - 4) {
				return [1, -1, total - 4, total - 3, total - 2, total - 1, total];
			} else {
				return [1, -1, current - 1, current, current + 1, -1, total];
			}

		}

		return [1, 2, 3, 4, 5, -1, total];
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