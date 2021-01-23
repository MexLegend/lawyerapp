import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgPipe } from './img.pipe';
import { FilterPipe } from './filter.pipe';
import { SafeHtml } from './safeUrl.pipe';
import { ReversePipe } from './reverse.pipe';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FilterPipe, ImgPipe, ReversePipe, SafeHtml],
  exports: [
    FilterPipe,
    ImgPipe,
    ReversePipe,
    SafeHtml
  ]
})
export class PipesModule {
}
