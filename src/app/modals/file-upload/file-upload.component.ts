import { Component, OnInit, Input } from "@angular/core";
import { ImgService } from "../../services/img.service";
import { HttpEventType, HttpErrorResponse } from "@angular/common/http";
import { FileUploader } from "ng2-file-upload";
import { UsersService } from "../../services/users.service";
import { UpdateDataService } from "../../services/updateData.service";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs/internal/observable/of";
import { NotificationsService } from "../../services/notifications.service";
import { TrackingService } from "../../services/tracking.service";

declare var $: any;

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent implements OnInit {
  constructor(
    public _trackingS: TrackingService,
    public _imgS: ImgService,
    public _notificationsS: NotificationsService,
    public _updateDS: UpdateDataService,
    public _userS: UsersService
  ) {}

  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;

  file: File;
  totalFiles: number = 0;
  img: File = null;
  previewUrl: any = null;
  @Input() typeImg: string;
  @Input() idImg: string;
  progress: number = 0;
  progressT: number = 0;

  public onFileSelected(event: any) {

    let validExtensions = ["doc", "docx", "pdf"];

    for (let index = 0; index < event.length; index++) {
      let extension = event[index].name.split(".")[1];
      if (validExtensions.indexOf(extension) < 0) {

        this._notificationsS.message(
          "error",
          "Formato no valido",
          `Sólo se permiten: ${validExtensions.join(", ")}`,
          false,
          false,
          "",
          "",
          2000
        );
        return;
      } else {
        if (this._trackingS.files.length < 3) {
          const file = event[index];
          this._trackingS.files.push({
            data: file,
            inProgress: false,
            progress: 0,
          });
        } else {
          this._notificationsS.message(
            "error",
            "Limite de archivos exedido",
            "Sólo se permiten 3 archivos",
            false,
            false,
            "",
            "",
            2000
          );
          return;
        }
      }
    }

  }

  ngOnInit() {}

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

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this._trackingS.files.splice(index, 1);
  }


  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals?) {
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
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  // typeFile(files: any) {
  //   if (files[0].type.match(/image\/*/) === null) {
  //     this.prepareFilesList(files);
  //   } else {
  //     this.img = files[0];
  //     this.preview();
  //   }
  // }

  uploadFile(file?) {
    file.inProgress = true;
    this._updateDS.getFileData().subscribe((data: any) => {

      if (data !== null) {
        if (localStorage.getItem("tracking")) {
          this._trackingS
            .updateTracking(
              localStorage.getItem("trackingDOC"),
              this._trackingS.files
            )
            .pipe(
              map((event) => {
                switch (event.type) {
                  case HttpEventType.UploadProgress:
                    file.progress = Math.round(
                      (event.loaded * 100) / event.total
                    );
                    break;
                  case HttpEventType.Response:
                    this.totalFiles += 1;
                    this.progressT = Math.round(
                      (this.totalFiles / this.totalFiles) * 100
                    );

                    if(this.progressT === 100) {
                      $("#modal-File-Upload").modal('close');
                    }

                    file.inProgress = false;

                    return event;
                }
              }),
              catchError((error: HttpErrorResponse) => {
                file.inProgress = false;
                return of(`${file.data.name} upload failed.`);
              })
            )
            .subscribe((event: any) => {
              if (typeof event === "object") {
              }
            });
        } else {

          let idFile = localStorage.getItem("fileData")
            ? JSON.parse(localStorage.getItem("fileData"))._id
            : data._id;

          this._trackingS
            .createTracking(idFile, this._trackingS.files)
            .pipe(
              map((event) => {
                switch (event.type) {
                  case HttpEventType.UploadProgress:
                    file.progress = Math.round(
                      (event.loaded * 100) / event.total
                    );
                    break;
                  case HttpEventType.Response:
                    this.totalFiles += 1;
                    this.progressT = Math.round(
                      (this.totalFiles / this.totalFiles) * 100
                    );

                    if (this.progressT === 100) {
                      $("#modal-File-Upload").modal("close");
                    }

                    file.inProgress = false;
                    localStorage.setItem("tracking", JSON.stringify(true));

                    return event;
                }
              }),
              catchError((error: HttpErrorResponse) => {
                file.inProgress = false;
                return of(`${file.data.name} upload failed.`);
              })
            )
            .subscribe((event: any) => {
              if (typeof event === "object") {
                if (event.body) {
                  localStorage.setItem("trackingDOC", event.body.tracking._id);
                }
              }
            });
        }
      }
    });
  }

  private uploadFiles() {
    this._trackingS.files.forEach((file) => {
      this.uploadFile(file);
    });
  }
}
