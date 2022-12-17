import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

	fileName: string = 'No file selected yet';
	@Input('label') title: string = 'Choose files to upload';
	@Input('accept') allowedFilesList!: string;
	@ViewChild('fileUploadInput') readonly fieUploadInput!: ElementRef<HTMLInputElement>

	handleFileUploadBtnClick() {
		this.fieUploadInput.nativeElement.click();
	}

	handleFileSelectChange(ev: Event) {
		const fileUploadInput = ev.currentTarget as HTMLInputElement;
		const file: File | null = fileUploadInput.files?.[0] ?? null;

		if (file) {
			this.fileName = file.name;
		}

	}

}
