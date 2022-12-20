import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SpreadPipe, RemoveDotsPipe } from './pipes';
import { MaxlengthValidatorDirective, PasswordsMatchValidatorDirective, DuplicateCredentialsValidatorDirective } from './directives';


@NgModule({
	declarations: [
    	FileUploadComponent,
     	SpreadPipe,
      	RemoveDotsPipe,
       	MaxlengthValidatorDirective,
        PasswordsMatchValidatorDirective,
        DuplicateCredentialsValidatorDirective
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
		DuplicateCredentialsValidatorDirective
	]
})
export class SharedModule { }
