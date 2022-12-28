import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'projects/recipes-blog-app/src/app/core/services';
import { IUser } from 'projects/recipes-blog-app/src/app/shared/interfaces';


@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

	readonly currentUser$: Observable<IUser | null> = this.authService.currentUser$; 

	constructor(
		private readonly authService: AuthService
	) { }

}
