import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "truncateHtml",
})
export class TruncateHtmlPipe implements PipeTransform {
  transform(text: string) {
    if (!text) {
      return text;
    }

    let without_html = text
      .replace(/<(?:.|\n)*?>/gm, " ")
      .replace(/ +(?= )/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");

    return without_html;
  }
}
