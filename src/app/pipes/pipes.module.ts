import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgPipe } from './img.pipe';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ImgPipe],
  exports: [
    ImgPipe
  ]
})
export class PipesModule {
}
