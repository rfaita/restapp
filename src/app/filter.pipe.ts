import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, filter: string): string {
    if (!filter) {
      return value;
    } else if (value) {
      return value.filter(item => {
        for (const key in item) {
          if ((typeof item[key] === 'string' || item[key] instanceof String) &&
            (item[key].toUpperCase().indexOf(filter.toUpperCase()) !== -1)) {
            return true;
          }
        }
      });
    }
  }

}
