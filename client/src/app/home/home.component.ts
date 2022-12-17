import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IRootState } from '../state';
import { IUser } from '../shared/interfaces';



@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent { 

	readonly currentUser$: Observable<IUser | null> = this.state.select((state) => state.currentUser)

	constructor(
		private readonly state: Store<IRootState>
	) { }

}