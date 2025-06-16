import { Pipe, PipeTransform } from '@angular/core';
import { secondsToHhMm } from '../helpers';

@Pipe({
  name: 'toHhMm'
})
export class ToHhMmPipe implements PipeTransform {
  transform(seconds: number) {
    return secondsToHhMm(seconds);
  }
}
