import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';

@Component({
	selector: 'app-file-upload, app-file-upload[ngModel], app-file-upload[formControl], app-file-upload[formControlName]',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FileUploadComponent),
			multi: true
		}
	]
})
export class FileUploadComponent implements ControlValueAccessor {

	@Input() placeholder: string = 'No file selected yet';
	@Input() disabled: boolean = false;
	@Input() label: string = 'Choose files to upload';
	@Input('accept') allowedFilesList!: string;

	@ViewChild('fileUploadInput') readonly fieUploadInput!: ElementRef<HTMLInputElement>

	private _selectedFile: File | null = null;
	private _onChangeCallback: any = () => {};
	private _onTouchedCallback: any = () => {};

	handleFileUploadBtnClick(): void {
		this.fieUploadInput.nativeElement.click();
	}

	handleFileSelectChange(ev: Event): void {
		const fileUploadInput = ev.currentTarget as HTMLInputElement;
		this.writeValue(fileUploadInput.files?.[0] ?? null);
		this.placeholder = this._selectedFile ? this._selectedFile.name : 'No file selected yet';
		this._onChangeCallback(this._selectedFile);
		this._onTouchedCallback(true);
	}

	writeValue(value: File | null): void {
		this._selectedFile = value;
	}

	registerOnChange(fn: any): void {
		this._onChangeCallback = fn;
	}

	registerOnTouched(fn: any): void {
		this._onTouchedCallback = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

}
