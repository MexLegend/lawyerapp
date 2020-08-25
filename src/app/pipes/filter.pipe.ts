import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "filter",
    pure: false,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], filter: string, typeField: string, status: string = 'all'): any {

    let statusN = status.length <= 3 ? 'all' : status.split('.')[1];
    
    if (!items || !filter) {
      if (statusN && statusN !== undefined && statusN !== "all") {
        return items.filter(
          (item) => item.status.toLowerCase().indexOf(statusN) !== -1
        );
      } else {
        return items;
      }
    }

    
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    let filterValue = filter.toLowerCase();

    if (
        filterValue !== undefined &&
        filterValue !== null &&
        filterValue !== ""
    ) {
        if (typeField === "case") {
          return items.filter(
            (item) => item.affair.toLowerCase().indexOf(filterValue) !== -1
          );
        } else if (typeField === "note") {
          if(statusN && statusN !== undefined && statusN !== 'all') {
            return items.filter(
              (item) => {
                if (item.status.toLowerCase() === statusN) {
                  return (
                    item.affair.toLowerCase().indexOf(filterValue) !== -1
                  );
                }
              }
                 
            );
          } else if(statusN && statusN === 'all') {
            return items.filter((item) => item.affair.toLowerCase().indexOf(filterValue) !== -1);
          } else {
            return items;
          }
        } else if (typeField === "post") {
          return items.filter(
            (item) => item.title.toLowerCase().indexOf(filterValue) !== -1
          );
        } else if (typeField === "user") {
          return items.filter(
            (item) =>
              item.firstName.toLowerCase().indexOf(filterValue) !== -1
          );
        }

    } else {
        return items;
    }
}
}
