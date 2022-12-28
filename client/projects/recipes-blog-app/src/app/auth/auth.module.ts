import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';

import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';


@NgModule({
	declarations: [
    	SignInComponent,
     	SignUpComponent
  ],
	imports: [
		CommonModule,
		AuthRoutingModule, 
		FormsModule, 
		SharedModule
	],
	exports: [
		SignInComponent, 
		SignUpComponent
	],
	providers: []
})
export class AuthModule { }
