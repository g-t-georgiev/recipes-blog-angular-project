import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersRoutingModule } from './users-routing.module';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';


@NgModule({
	declarations: [
    	ProfileComponent,
     	ProfileDetailsComponent
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
