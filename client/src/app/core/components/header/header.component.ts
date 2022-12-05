import { 
	Component, 
	OnInit, 
	OnDestroy, 
	HostBinding,  
} from '@angular/core';

import { Subscription } from 'rxjs';

import { ViewportResizeService } from '../../services/viewport-resize.service';



@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

	private subscription!: Subscription;

	isNavCollapsed: boolean = false;

	@HostBinding('class.fullscreen') expand: boolean = false;

	constructor(
		private resizeService: ViewportResizeService
	) { }

	ngOnInit(): void {
		this.isNavCollapsed = !this.resizeService.hasMatch();
		this.expand = this.resizeService.hasMatch() && this.isNavCollapsed;

		this.subscription = this.resizeService.onMaxWidth780$.subscribe({
			next: ({ matches }) => {
				this.isNavCollapsed = !matches;
				this.expand = matches && this.isNavCollapsed;
			}
		});
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	onMenuButtonToggle(menuBtnToggled: boolean) {
		this.isNavCollapsed = menuBtnToggled;
		this.expand = this.isNavCollapsed;
	}
}
