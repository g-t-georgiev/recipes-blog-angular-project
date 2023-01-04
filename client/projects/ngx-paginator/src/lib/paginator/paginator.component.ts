import { CommonModule } from '@angular/common';
import {
	Component,
	OnInit,
	OnChanges,
	SimpleChanges,
	Input,
	Output,
	EventEmitter,
	ChangeDetectionStrategy,
} from '@angular/core';

@Component({
	selector: 'ngx-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule
	],
	providers: []
})
export class PaginatorComponent implements OnInit, OnChanges {

	@Input('current') currentPage: number = 1;
	@Input('total') totalPagesCount: number = 0;

	@Output() goTo: EventEmitter<number> = new EventEmitter<number>();
	@Output() next: EventEmitter<number> = new EventEmitter<number>();
	@Output() previous: EventEmitter<number> = new EventEmitter<number>();

	pages: number[] = [];

	ngOnInit() {

		if (
			this.currentPage &&
			this.totalPagesCount
		) {
			this.pages = this.getPages(this.currentPage, this.totalPagesCount);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		// console.log(changes);
		// console.log(this.getPages(this.currentPage, this.totalPagesCount));
		this.pages = this.getPages(this.currentPage, this.totalPagesCount);
	}

	getPages(current: number, total: number): number[] {

		if (total <= 7) {
			
			if (total === 0) {
				return [ 1 ];
			}

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

		if (page === this.currentPage) {
			return;
		}

		this.goTo.emit(page);
	}

	onNext(): void {

		if (this.currentPage >= this.totalPagesCount) {
			return;
		}

		const nextPage = this.currentPage + 1;
		this.next.emit(nextPage);
	}

	onPrevious(): void {

		if (this.currentPage === 1) {
			return;
		}
		
		const prevPage = this.currentPage - 1;
		this.previous.emit(prevPage);
	}

}