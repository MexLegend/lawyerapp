import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgPipe } from './img.pipe';
import { FilterPipe } from './filter.pipe';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FilterPipe, ImgPipe],
  exports: [
    FilterPipe,
    ImgPipe
  ]
})
export class PipesModule {
}
