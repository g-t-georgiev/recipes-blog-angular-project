import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'spread'
})
export class SpreadPipe implements PipeTransform {

	transform(value: string | string[]): string {
		if (typeof value === 'string') {
			return value;
		}
		
		return value.join(', ');
	}

}
