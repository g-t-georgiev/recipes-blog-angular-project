import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersRoutingModule } from './users-routing.module';


@NgModule({
	declarations: [
    	ProfileComponent
  ],
	imports: [
		CommonModule,
		UsersRoutingModule
	],
	exports: [
		ProfileComponent
	],
	providers: []
})
export class UsersModule { }
