import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

	submitHandler(formModel: NgForm) {

		if (formModel.invalid) {
			return;
		}

		console.log(formModel.form.value);
	}

}
