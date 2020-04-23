import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'img'
})
export class ImgPipe implements PipeTransform {
    transform(img: string, type: string, view: boolean): any {

        if (!img || (img === undefined && view) || (img === null && view) || (img === '' && view) || (img.indexOf('no_image') >= 0)) {
            switch (type) {
                case 'post':
                    img = '../../../assets/images/New_image.jpg';
                    break;

                case 'user':
                    img = '../../../assets/images/not-user.jpg';
                    break;
            }
        }        

        return img;
    }
}