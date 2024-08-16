import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maskPassword' })
export class MaskPasswordPipe implements PipeTransform {
    transform(value: string): string {
        // If password exists and it's not empty
        if (value && value.length > 0) {
            return '*'.repeat(value.length);
        }
        return ''; // Return empty string if no password
    }
}
