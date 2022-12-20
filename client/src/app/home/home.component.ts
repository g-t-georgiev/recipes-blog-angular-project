import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { IUser } from '../shared/interfaces';
import { AuthService } from '../core/services';



@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent { 

	readonly currentUser$: Observable<IUser | null> = this.authService.currentUser$;
	readonly isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;

	constructor(
		private readonly authService: AuthService
	) { }

}