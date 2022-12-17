import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SpreadPipe, RemoveDotsPipe } from './pipes';


@NgModule({
	declarations: [
    	FileUploadComponent,
     	SpreadPipe,
      	RemoveDotsPipe
  ],
	imports: [
		CommonModule,
	],
	exports: [
		FileUploadComponent, 
		SpreadPipe, 
		RemoveDotsPipe
	]
})
export class SharedModule { }
