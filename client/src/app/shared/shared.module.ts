import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SpreadPipe, RemoveDotsPipe } from './pipes';
import { MaxlengthValidatorDirective, PasswordsMatchValidatorDirective, ExistingEmailValidatorDirective } from './directives';


@NgModule({
	declarations: [
    	FileUploadComponent,
     	SpreadPipe,
      	RemoveDotsPipe,
       	MaxlengthValidatorDirective,
        PasswordsMatchValidatorDirective,
        ExistingEmailValidatorDirective
  ],
	imports: [
		CommonModule,
	],
	exports: [
		FileUploadComponent, 
		SpreadPipe, 
		RemoveDotsPipe,
		MaxlengthValidatorDirective,
		PasswordsMatchValidatorDirective,
		ExistingEmailValidatorDirective
	]
})
export class SharedModule { }
