import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImgPipe } from "./img.pipe";
import { FilterPipe } from "./filter.pipe";
import { SafeHtml } from "./safeUrl.pipe";
import { ReversePipe } from "./reverse.pipe";
import { TruncateHtmlPipe } from "./truncateHtml.pipe";
import { SanitizeHtmlPipe } from "./safeHtml.pipe";
@NgModule({
  imports: [CommonModule],
  declarations: [
    FilterPipe,
    ImgPipe,
    ReversePipe,
    SafeHtml,
    SanitizeHtmlPipe,
    TruncateHtmlPipe,
  ],
  exports: [
    FilterPipe,
    ImgPipe,
    ReversePipe,
    SafeHtml,
    SanitizeHtmlPipe,
    TruncateHtmlPipe,
  ],
})
export class PipesModule {}
