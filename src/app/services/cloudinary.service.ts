import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, Subject } from "rxjs";
import {
  FileUploader,
  ParsedResponseHeaders,
  FileUploaderOptions,
} from "ng2-file-upload";
import { Cloudinary } from "@cloudinary/angular-5.x";
import { UpdateDataService } from "./updateData.service";
import { NotificationsService } from "./notifications.service";

@Injectable({
  providedIn: "root",
})
export class CloudinaryService {
  public uploader: FileUploader;
  image: any = null;
  file: any = null;
  fileUrl: any = null;
  previewUrl: any = null;
  typeFile: string;
  typeFileUpload: string;

  private fileSubject = new Subject<any>();
  private imgSubject = new Subject<any>();
  private fileTypeSubject = new Subject<any>();

  constructor(
    private cloudinary: Cloudinary,
    private http: HttpClient,
    public _updateDS: UpdateDataService,
    public _notificationsS: NotificationsService
  ) {
    // Get Upload Action Type User / File / Post
    this.getFileType().subscribe((data) => {
      this.typeFile = data;
    });
  }

  // Subject Functions

  getFile(): Observable<any> {
    return this.fileSubject.asObservable();
  }

  setFile(url: string, public_id: string, size: string, name: string) {
    this.fileSubject.next({ url, public_id, size, name });
  }

  getFileType(): Observable<any> {
    return this.fileTypeSubject.asObservable();
  }

  setFileType(type: string) {
    this.fileTypeSubject.next(type);
  }

  getImg(): Observable<any> {
    return this.imgSubject.asObservable();
  }

  sendImg(url: string, public_id: string) {
    this.imgSubject.next({ url, public_id });
  }

  // Normal Functions

  clearQueue() {
    this.uploader.clearQueue();
  }

  duplicatedFileError(file: any) {
    this._notificationsS.message(
      "error",
      "El documento " + file + " ya se encuentra agregado",
      "Selecciona un documento diferente",
      false,
      false,
      "",
      "",
      3000
    );
  }

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

  formatInvalidError(type: string) {
    let validExtensions: any;

    console.log(type);
    

    if (type === "img") {
      validExtensions = ["png", "jpg", "jpeg", "gif", "webp", "jfif"];

      this._notificationsS.message(
        "error",
        "Formato no valido",
        `Sólo se permiten: ${validExtensions.join(", ")}`,
        false,
        false,
        "",
        "",
        3000
      );
      this.clearQueue();
    } else {
      validExtensions = [
        "doc",
        "docx",
        "pdf",
        "png",
        "jpg",
        "jpeg",
        "gif",
        "webp",
        "jfif",
      ];

      this._notificationsS.message(
        "error",
        "Formato no valido",
        `Sólo se permiten: ${validExtensions.join(", ")}`,
        false,
        false,
        "",
        "",
        3000
      );
    }
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

  uploaderSend(typeFileUpload: string) {
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${
        this.cloudinary.config().cloud_name
      }/auto/upload`,
      // Limit Format Types
      allowedFileType:
        typeFileUpload === "evidences"
          ? ["doc", "docx", "pdf", "image"]
          : ["image"],
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

    this.uploader = new FileUploader(uploaderOptions);

    const upsertResponse = (fileItem) => {
      // Check if HTTP request was successful
      // console.log(fileItem)
      if (fileItem.status !== 200) {
        console.log("Upload to cloudinary Failed");
        return false;
      }
      // console.log(fileItem.data.url);
    };

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary unsigned upload preset to the upload form
      form.append("upload_preset", this.cloudinary.config().upload_preset);

      // Add file to upload
      form.append("file", fileItem);

      // Add folder
      form.append(
        "folder",
        this.typeFile === "user"
          ? "Users"
          : this.typeFile === "file"
          ? "Files"
          : "Posts"
      );

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
      const name = `${data.original_filename}.${data.url.split(".").pop()}`;
      const url = data.url;
      const public_id = data.public_id;
      const size = data.bytes;
      this.setFile(url, public_id, size, name);
    };

    // Get Last Item Of Uploader Queue
    this.uploader.onAfterAddingFile = (file) => {
      // Render Image Preview After Adding File Item
      var image_file = file._file;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.image = reader.result.toString();
      });
      reader.readAsDataURL(image_file);

      if (typeFileUpload === "image") {
        this.uploader.queue = [this.uploader.queue.pop()];
      }
    };
  }
}
