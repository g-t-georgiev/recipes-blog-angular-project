import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SpreadPipe, RemoveDotsPipe } from './pipes';
import { MaxlengthValidatorDirective } from './directives/maxlength-validator.directive';
import { PasswordsMatchValidatorDirective } from './directives/passwords-match-validator.directive';


@NgModule({
	declarations: [
    	FileUploadComponent,
     	SpreadPipe,
      	RemoveDotsPipe,
       	MaxlengthValidatorDirective,
        PasswordsMatchValidatorDirective
  ],
	imports: [
		CommonModule,
	],
	exports: [
		FileUploadComponent, 
		SpreadPipe, 
		RemoveDotsPipe,
		MaxlengthValidatorDirective,
		PasswordsMatchValidatorDirective
	]
})
export class SharedModule { }
