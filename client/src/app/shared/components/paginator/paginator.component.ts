import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent {

	@Input('current') currentPage: number = 0;
	@Input('total') totalPagesCount: number = 0;

	@Output() goTo: EventEmitter<number> = new EventEmitter<number>();
	@Output() next: EventEmitter<number> = new EventEmitter<number>();
	@Output() previous: EventEmitter<number> = new EventEmitter<number>();

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
