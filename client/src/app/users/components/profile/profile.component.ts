import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces';

import { IRootState } from 'src/app/state';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

	readonly currentUser$: Observable<IUser | null> = this.globalState.select(state => state.currentUser); 

	constructor(
		private readonly globalState: Store<IRootState>
	) { }

}
