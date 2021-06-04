import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImgPipe } from "./img.pipe";
import { FilterPipe } from "./filter.pipe";
import { SafeHtml } from "./safeUrl.pipe";
import { ReversePipe } from "./reverse.pipe";
import { TruncateHtmlPipe } from "./truncateHtml.pipe";
import { SanitizeHtmlPipe } from "./safeHtml.pipe";
import { StringFilterPipe } from './stringFilter.pipe';
import { DateAgoPipe } from './dateAgo.pipe';
import { OrderByPipe } from './orderBy.pipe';
@NgModule({
  imports: [CommonModule],
  declarations: [
    DateAgoPipe,
    FilterPipe,
    ImgPipe,
    OrderByPipe,
    ReversePipe,
    SafeHtml,
    SanitizeHtmlPipe,
    StringFilterPipe,
    TruncateHtmlPipe,
  ],
  exports: [
    DateAgoPipe,
    FilterPipe,
    ImgPipe,
    OrderByPipe,
    ReversePipe,
    SafeHtml,
    SanitizeHtmlPipe,
    StringFilterPipe,
    TruncateHtmlPipe,
  ],
})
export class PipesModule {}
