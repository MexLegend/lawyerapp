import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { UsersService } from "./users.service";
import { Observable } from "rxjs";
import {
  FileUploader,
  ParsedResponseHeaders,
  FileUploaderOptions,
} from "ng2-file-upload";
import { Cloudinary } from "@cloudinary/angular-5.x";
import { CloudinaryService } from "./cloudinary.service";

@Injectable({
  providedIn: "root",
})
export class ImgService {
  constructor(
    private cloudinary: Cloudinary,
    private http: HttpClient,
    public _cloudinaryS: CloudinaryService,
    public _userS: UsersService
  ) {}

  image: any = null;
  previewUrl: any = null;
  file: any = null;
  fileUrl: any = null;
  public uploader: FileUploader;

  imageValidation($event) {
    if ($event.target.files && $event.target.files[0]) {
      this.file = $event.target.files[0] as File;
      var reader = new FileReader();
      reader.onload = ($event: any) => {
        this.fileUrl = $event.target.result;
        return this.fileUrl;
      };
      reader.readAsDataURL($event.target.files[0]);
    } else {
      this.file = null;
      this.fileUrl = null;
    }
  }

  clearQueue() {
    this.uploader.clearQueue();
  }

  public onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      let img: any;

      if (event.type && event.type === "change") {
        img = event.target.files[0];
      } else {
        img = event[0];
      }

      this.image = img;

      this.preview();
    }
  }

  preview() {
    var reader = new FileReader();
    reader.readAsDataURL(this.image);
    reader.onload = (_event) => {
      this.image = reader.result;
    };
  }

  upload(img: object, type: string, id: string): Observable<any> {
    const url = `${environment.URI}/api/img`;
    const data = {
      img,
      type,
      id,
    };

    return this.http.put(url, data);
  }

  uploaderSend(typeImg: string, idImg?: string) {
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${
        this.cloudinary.config().cloud_name
      }/image/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: false,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: "X-Requested-With",
          value: "XMLHttpRequest",
        },
      ],
    };

    const upsertResponse = (fileItem) => {
      // Check if HTTP request was successful
      // console.log(fileItem)
      if (fileItem.status !== 200) {
        console.log("Upload to cloudinary Failed");
        return false;
      }
      // console.log(fileItem.data.url);
    };

    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary unsigned upload preset to the upload form
      form.append("upload_preset", this.cloudinary.config().upload_preset);

      // Add file to upload
      form.append("file", fileItem);

      // Add folder
      form.append("folder", typeImg === "user" ? "Users" : "Posts");

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    this.uploader.onCompleteItem = (
      item: any,
      response: string,
      status: number,
      headers: ParsedResponseHeaders
    ) => {
      upsertResponse({
        file: item.file,
        status,
        data: JSON.parse(response),
      });
      const data = JSON.parse(response);
      const url = data.url;
      const public_id = data.public_id;
      this._cloudinaryS.sendImg(url, public_id);
      // return;
      //   this.upload(img, typeImg, idImg).subscribe((r) => {
      //     this._userS.saveStorage(
      //       this._userS.user._id,
      //       this._userS.token,
      //       r.user
      //     );
      //     $("#modal-File-Upload").modal("close");
      //   });
    };
  }
}
