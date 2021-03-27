import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, Subject } from "rxjs";
import {
  FileUploader,
  ParsedResponseHeaders,
  FileUploaderOptions,
  FileItem,
} from "ng2-file-upload";
import { Cloudinary } from "@cloudinary/angular-5.x";
import { UpdateDataService } from "./updateData.service";
import { NotificationsService } from "./notifications.service";

@Injectable({
  providedIn: "root",
})
export class CloudinaryService {
  static folderClass = class {
    mainFolder: string;
    subfolder: string;
  };

  public uploader: FileUploader;
  cloudinaryItemsToDeleteArray: Array<any> = [];
  file: any = null;
  fileUrl: any = null;
  folder = new CloudinaryService.folderClass();
  image: any = null;
  previewUrl: any = null;
  uploadActionType: string;
  uploadAttachedFilesList: Array<any> = [];
  uploadFileId: string;
  uploadFileType: string;
  uploadMainImage: any = null;
  uploadMultipleImagesList: Array<any> = [];

  private globalAttachedFileList = new Subject<[Array<any>, string]>();
  private fileSubject = new Subject<any>();
  private imgSubject = new Subject<any>();
  private fileTypeSubject = new Subject<[string, string]>();
  private uploadFileTypeSubject = new Subject<[string, string, string]>();
  private uploadMultipleImagesListSubject = new Subject<[Array<any>, string]>();

  constructor(
    private cloudinary: Cloudinary,
    private http: HttpClient,
    public _updateDS: UpdateDataService,
    public _notificationsS: NotificationsService
  ) {
    // Get Upload Folder Type User / File / Post
    this.getFileType().subscribe(([mainFolder, subfolder]) => {
      this.folder = { mainFolder, subfolder };
    });

    // Get Upload File Type Image / Document
    this.getFileUploadType().subscribe(([actionType, fileType, id]) => {
      this.uploadActionType = actionType;
      this.uploadFileType = fileType;
      this.uploadFileId = id;
    });
  }

  // Subject Functions

  getFile(): Observable<any> {
    return this.fileSubject.asObservable();
  }

  setFile(
    url: string,
    public_id: string,
    size: string,
    name: string,
    tags: Array<string>,
    context: string
  ) {
    this.fileSubject.next({ url, public_id, size, name, tags, context });
  }

  getFileType(): Observable<any> {
    return this.fileTypeSubject.asObservable();
  }

  setFileType(folder: string, subfolder?: string) {
    this.fileTypeSubject.next([folder, subfolder]);
  }

  getFileUploadType(): Observable<any> {
    return this.uploadFileTypeSubject.asObservable();
  }

  setFileUploadType(actionType: string, fileType?: string, id?: string) {
    this.uploadFileTypeSubject.next([actionType, fileType, id]);
  }

  getImg(): Observable<any> {
    return this.imgSubject.asObservable();
  }

  sendImg(url: string, public_id: string) {
    this.imgSubject.next({ url, public_id });
  }

  // Normal Functions

  configurateUploaderBeforeUpload(): Promise<Boolean> {
    let response: boolean = false;
    try {
      this.uploader.clearQueue();

      // Add Attached Files List To Queue If There Are Any
      if (this.uploadAttachedFilesList.length > 0)
        this.uploadAttachedFilesList.map((attachedFile: FileItem) => {
          attachedFile.formData.push({
            caption: "attachedFile",
            alt: this.generateRandomPass(24),
          });
          this.uploader.queue.push(attachedFile);
        });
      // Add Main Image To Queue If There Is Any
      if (this.uploadMainImage) {
        this.uploadMainImage.formData.push({
          caption: "mainImage",
          alt: "mainImage",
        });
        this.uploader.queue.push(this.uploadMainImage);
      }
      // Add Multiple Images List To Queue If There Are Any
      if (this.uploadMultipleImagesList.length > 0)
        this.uploadMultipleImagesList.map((image: any) => {
          image.image.formData.push({
            caption: "multipleImages",
            alt: image._id,
          });
          this.uploader.queue.push(image.image);
        });

      response = true;
    } catch (error) {
      console.log(error);
      response = false;
    }

    return new Promise((resolve, reject) => resolve(response));
  }

  clearQueue() {
    this.uploader.clearQueue();
  }

  // Delete Item From Array
  deleteItemFromArray(item: any, arrayType: string) {
    if (arrayType === "attachedFile") {
      this.setGlobalAttachedFilesList([item], "delete");
      this.uploadAttachedFilesList = this.uploadAttachedFilesList.filter(
        (attachedFile) => attachedFile.file.name !== item.name
      );
    } else {
      this.setMultipleImagesListSubject([item], "delete");
      this.uploadMultipleImagesList = this.uploadMultipleImagesList.filter(
        (image) => image.image.file.name !== item.name
      );
    }

    // Add Items To Array To Delete Them From Cloudinary
    if (item.public_id) this.cloudinaryItemsToDeleteArray.push(item.public_id);
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

  formatInvalidError() {
    let validExtensions: any;

    if (this.uploadActionType === "image") {
      validExtensions = this.validExtensions(this.uploadActionType);

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
      validExtensions = this.validExtensions(this.uploadActionType);

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

  // Generate Default Random 15 Characters Password
  generateRandomPass(length: Number = 15): string {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Render Image Preview After Adding File Item
  renderImagePreview(file: any) {
    var image_file = file._file;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      this.image = reader.result.toString();
    });
    reader.readAsDataURL(image_file);
  }

  // Reset Uploader Arrays
  resetUploaderArrays() {
    this.uploadMainImage = null;
    this.uploadAttachedFilesList = [];
    this.uploadMultipleImagesList = [];
  }

  // Set Attached Files List
  setAttachedFilesList(file: any) {
    this.uploadAttachedFilesList = [...this.uploadAttachedFilesList, file];
    this.setGlobalAttachedFilesList(
      [{ _id: this.generateRandomPass(), ...file.file }],
      "push"
    );
  }

  // Set Main Image
  setMainImage(image: any) {
    this.renderImagePreview(image);
    this.uploadMainImage = image;
  }

  // Set Multiple Images List
  setMultipleImagesList(image: any) {
    this.uploadMultipleImagesList = [
      ...this.uploadMultipleImagesList,
      { _id: this.uploadFileId, image },
    ];
    this.setMultipleImagesListSubject(
      [{ _id: this.uploadFileId, ...image.file }],
      "push"
    );
  }

  getMultipleImagesListSubject(): Observable<any> {
    return this.uploadMultipleImagesListSubject.asObservable();
  }

  setMultipleImagesListSubject(file: any, action: string) {
    this.uploadMultipleImagesListSubject.next([file, action]);
  }

  getGlobalAttachedFilesList(): Observable<[Array<any>, string]> {
    return this.globalAttachedFileList.asObservable();
  }

  setGlobalAttachedFilesList(attachedFile: any, action: string) {
    this.globalAttachedFileList.next([attachedFile, action]);
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

  uploaderSend() {
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${
        this.cloudinary.config().cloud_name
      }/auto/upload`,
      // Limit Format Types
      allowedFileType:
        ["file"].indexOf(this.uploadActionType) > -1
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

    // Check if HTTP request was successful
    const upsertResponse = (fileItem: any) => {
      if (fileItem.status !== 200) {
        console.log("Upload to cloudinary Failed");
        return false;
      }
      // console.log(fileItem.data.url);
    };

    // Configurate Cloudinary Data Before Upload Files
    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary unsigned upload preset to the upload form
      form.append("upload_preset", this.cloudinary.config().upload_preset);

      // Add File Title And Description
      if (fileItem.formData.length > 0)
        form.append(
          "context",
          `alt=${fileItem.formData[0].alt}|caption=${fileItem.formData[0].caption}`
        );

      // Add folder
      form.append(
        "folder",
        this.folder.mainFolder === "user"
          ? "Users"
          : this.folder.mainFolder === "file"
          ? "Files"
          : `Posts/${this.folder.subfolder}`
      );

      // Add file to upload
      form.append("file", fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    // Set Data After File Has Been Uploaded Successfully
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
      this.resetUploaderArrays();
      const data = JSON.parse(response);
      const name = `${data.original_filename}.${data.url.split(".").pop()}`;
      const url = data.secure_url;
      const public_id = data.public_id;
      const size = data.bytes;
      const tags = data.tags;
      const context = data.context ? data.context.custom : "";
      this.setFile(url, public_id, size, name, tags, context);
    };

    // Set Respective File Data After Adding Files
    this.uploader.onAfterAddingFile = (file) => {
      // Validate If File Upload Action Is For A Single Image
      if (this.uploadFileType === "mainImage") {
        this.setMainImage(file);
      }
      // Validate If File Upload Action Is For Multiple Images
      else if (this.uploadFileType === "multipleImages") {
        this.setMultipleImagesList(file);
      }
      // Validate If File Upload Action Is For Attached Files
      else {
        if (
          this.uploadAttachedFilesList.filter(
            (attachedFile: any) => attachedFile._file.name === file._file.name
          ).length === 0
        ) {
          this.setAttachedFilesList(file);
        } else {
          this.duplicatedFileError(file._file.name);
        }
      }
    };
  }

  validExtensions(type: string): Array<string> {
    let validExtensions: Array<string> = [];
    if (type === "img" || type === "image")
      validExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "tiff",
        "jfif",
      ];
    else
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

    return validExtensions;
  }
}
