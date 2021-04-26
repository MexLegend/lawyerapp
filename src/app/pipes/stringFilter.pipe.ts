import { Pipe, PipeTransform } from "@angular/core";
import { UtilitiesService } from "../services/utilities.service";

@Pipe({
  name: "stringFilter",
})
export class StringFilterPipe implements PipeTransform {
  constructor(private _utilitiesS: UtilitiesService) {}

  transform(
    array: Array<any>,
    filterValue: string,
    filterVariable: string,
    noDataContainer: any
  ) {
    if (!filterValue || filterValue === "") {
      return array;
    }
    const filteredArray = array.filter(
      (item) =>
        -1 <
        item[filterVariable].toLowerCase().indexOf(filterValue.toLowerCase())
    );

    if (filteredArray.length === 0) noDataContainer.classList.remove("hidden");
    else noDataContainer.classList.add("hidden");

    return filteredArray;
  }
}
