import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-file-upload',
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

	selectedFile: File | null = null;
	fileName: string = 'No file selected yet';
	@Input('label') title: string = 'Choose files to upload';
	@Input('accept') allowedFilesList!: string;
	@ViewChild('fileUploadInput') readonly fieUploadInput!: ElementRef<HTMLInputElement>

	private _onChange: (value: File | null) => void = () => {};
	private _onTouch: (touched: boolean) => void = () => {};
	private _isDisabled: boolean = false;

	public get isDisabled(): boolean {
		return this._isDisabled;
	}

	constructor() { }

	handleFileUploadBtnClick() {
		this.fieUploadInput.nativeElement.click();
	}

	handleFileSelectChange(ev: Event) {
		const fileUploadInput = ev.currentTarget as HTMLInputElement;
		this.selectedFile = fileUploadInput.files?.[0] ?? null;
		this.fileName = this.selectedFile ? this.selectedFile.name : 'No file selected yet';
		this._onChange(this.selectedFile);
		this._onTouch(true);
	}

	writeValue(obj: any): void {
		this.selectedFile = obj;
	}

	registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this._onTouch = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this._isDisabled = isDisabled;
	}

}
