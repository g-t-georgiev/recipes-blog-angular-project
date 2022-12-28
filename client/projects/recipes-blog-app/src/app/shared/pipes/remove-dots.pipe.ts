import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'removeDots'
})
export class RemoveDotsPipe implements PipeTransform {

	transform(value: string): string {
		if (value.indexOf('.') === -1) {
			return value;
		}

		return value.replaceAll('.', '');
	}

}
