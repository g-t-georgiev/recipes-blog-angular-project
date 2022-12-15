import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

	handleLogin(formModel: NgForm) {

		if (formModel.invalid) {
			return;
		}

		console.log(formModel);
	}

}
