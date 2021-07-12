import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "showFullMessage",
  pure: true,
})
export class ShowFullMessagePipe implements PipeTransform {
  transform(element: HTMLElement = null): boolean {
    let elementHeight: number = 0;
    let showFullMessage: boolean = false;

    const refreshInterval = setInterval(() => {
      if (elementHeight === 0) {
        elementHeight = element.offsetHeight;
      } else {
        showFullMessage = element.offsetHeight <= 100 ? true : false;
        clearInterval(refreshInterval);
      }
    }, 10);

    console.log(showFullMessage);

    return showFullMessage;
  }
}
