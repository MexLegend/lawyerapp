import { Component, OnInit, Input, EventEmitter } from "@angular/core";
import { ImgService } from "../../services/img.service";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  FileUploader,
  FileUploaderOptions,
  ParsedResponseHeaders
} from "ng2-file-upload";
import { Cloudinary } from "@cloudinary/angular-5.x";
import { UsersService } from '../../services/users.service';

declare var $: any;

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"]
})
export class FileUploadComponent implements OnInit {
  constructor(private cloudinary: Cloudinary, public _imgS: ImgService, public _userS: UsersService) { }

  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;

  files: any[] = [];
  img: File = null;
  previewUrl: any = null;
  @Input() typeImg: string;
  @Input() idImg: string;
  progress: number = 0;

  public onFileSelected(event: any) {
    let file: File;

    if(event.type && event.type === "change") {
      file = event.target.files[0];
    } else {
      file = event[0];
    }

    this.img = file;

    this.readBase64(file).then((data) => {
      this.previewUrl = data;
    });
  }

  ngOnInit() {
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
          value: "XMLHttpRequest"
        }
      ]
    };
    const upsertResponse = fileItem => {
      // Check if HTTP request was successful
      // console.log(fileItem)
      if (fileItem.status !== 200) {
        console.log("Upload to cloudinary Failed");
        console.log(fileItem);
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
      form.append("folder", this.typeImg === "user" ? "Users" : "Posts");

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
        data: JSON.parse(response)
      });
      const data = JSON.parse(response);
      const img = {
        url: data.url,
        public_id: data.public_id
      }
      this._imgS.upload(img, this.typeImg, this.idImg).subscribe((r) => {
        this._userS.saveStorage(this._userS.user._id, this._userS.token, r.user)
        $("#modal-File-Upload").modal('close');
      });
    }
  }

  readBase64(file): Promise<any> {
    var reader = new FileReader();
    var future = new Promise((resolve, reject) => {
      reader.addEventListener(
        "load",
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.addEventListener(
        "error",
        function (event) {
          reject(event);
        },
        false
      );

      reader.readAsDataURL(file);
    });
    return future;
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  clearImgQueue() {
    this.previewUrl = null;
    $("#file-upload").val(null);
    this.uploader.clearQueue()
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.typeFile(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  preview() {
    var reader = new FileReader();
    reader.readAsDataURL(this.img);
    reader.onload = _event => {
      this.previewUrl = reader.result;
    };
  }

  typeFile(files: any) {
    if (files[0].type.match(/image\/*/) === null) {
      this.prepareFilesList(files);
    } else {
      this.img = files[0];
      this.preview();
    }
  }
}
