import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "filter",
    pure: false,
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], filter: string, typeField: string): any {

        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        let filterValue = filter.toLowerCase();
        if (
            filterValue !== undefined &&
            filterValue !== null &&
            filterValue !== ""
        ) {

            if(typeField === 'case') {

                return items.filter(
                    (item) => item.affair.toLowerCase().indexOf(filterValue) !== -1
                );
            } else if(typeField === 'post') {

                return items.filter(
                    (item) => item.title.toLowerCase().indexOf(filterValue) !== -1
                );
            } else if(typeField === 'user') {

                return items.filter(
                    (item) => item.firstName.toLowerCase().indexOf(filterValue) !== -1
                );
            }

        } else {
            return items;
        }
    }
}
