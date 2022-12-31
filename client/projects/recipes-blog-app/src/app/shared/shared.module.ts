import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadComponent, PaginatorComponent } from './components';
import { SpreadPipe, RemoveDotsPipe } from './pipes';

import { 
	MaxlengthValidatorDirective, 
	PasswordsMatchValidatorDirective, 
	DuplicateCredentialsValidatorDirective, 
	MaxSizeDirective, 
	LinkActiveDirective 
} from './directives';

import { CustomValidatorsService } from './services';


@NgModule({
	declarations: [
    	FileUploadComponent,
     	SpreadPipe,
      	RemoveDotsPipe,
       	MaxlengthValidatorDirective,
        PasswordsMatchValidatorDirective,
        DuplicateCredentialsValidatorDirective,
        MaxSizeDirective,
        PaginatorComponent,
        LinkActiveDirective
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
		DuplicateCredentialsValidatorDirective,
		MaxSizeDirective,
		LinkActiveDirective,
		PaginatorComponent
	],
	providers: [
		CustomValidatorsService
	]
})
export class SharedModule { }
