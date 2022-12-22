import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ProfileComponent, ProfileDetailsComponent } from './components';

@NgModule({
	declarations: [
    	ProfileComponent,
     	ProfileDetailsComponent
  ],
	imports: [
		CommonModule,
		UsersRoutingModule, 
		FormsModule,
		SharedModule
	],
	exports: [
		ProfileComponent
	],
	providers: []
})
export class UsersModule { }
