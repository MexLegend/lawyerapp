import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "img",
})
export class ImgPipe implements PipeTransform {
  transform(img: string, type: string): any {
    if (img === null) {
      img = "no_image";
    }

    if (img.toString().indexOf("no_image") >= 0) {
      return this.noImgType(type);
    } else {
      return img;
    }
  }

  noImgType(type: string) {
    let img: string;
    switch (type) {
      case "post":
        img = "http://localhost:3001/ftp/uploads/New_image.jpg";
        break;

      case "user":
        img = "http://localhost:3001/ftp/uploads/not-user.jpg";
        break;

      default:
        img = "http://localhost:3001/ftp/uploads/New_image.jpg";
        break;
    }
    return img;
  }
}
