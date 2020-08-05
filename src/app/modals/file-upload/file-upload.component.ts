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
import { Subscription } from 'rxjs';

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
    public _usersS: UsersService
  ) {}

  public hasBaseDropZoneOver = false;
  public uploader: FileUploader;

  @Input() idImg: string;
  @Input() typeImg: string;
  file: File;
  img: File = null;
  previewUrl: any = null;
  progress: number = 0;
  progressT: number = 0;
  subscription: Subscription;

  ngOnInit() {
    this._imgS.uploaderSend("user");
    
    if (localStorage.getItem("trackingData")) {
      // Get Storage Subscription
      this._updateDS.watchTrackStorage().subscribe((data: any) => {
        this._trackingS.trackingStorage = true;
      });
    } else {
      // Get Storage Subscription
      this._updateDS.watchTrackStorage().subscribe((data: any) => {
        this._trackingS.trackingStorage = true;
      });
    }
  }

  addDocuments() {
    this._updateDS.setItemStorage(
      "documents",
      JSON.stringify(this._trackingS.files)
    );
    
    this._trackingS.disableCancelUpload = true;

    if (!localStorage.getItem("trackingData")) {
      let idFile = localStorage.getItem("fileData")
        ? JSON.parse(localStorage.getItem("fileData"))._id
        : null;
      this._trackingS.uploadDocs(idFile, null);

    } else {
      this._trackingS
        .uploadDocs(null, JSON.parse(localStorage.getItem("trackingData"))._id);
    }
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this._trackingS.files.splice(index, 1);
  }

  deleteImage() {
    this.previewUrl = null;
    this._imgS.clearQueue();
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

  public onFileSelected($event: any) {
    console.log($event.target.files);
    console.log(this.typeImg);
    console.log(this.idImg);

    let validExtensions;

    if ($event.target.files && $event.target.files[0]) {
      let event = $event.target.files;
      if (this.typeImg !== undefined && this.idImg !== undefined) {
        validExtensions = ["png", "jpg", "gif"];

        let extension = event[0].name.split(".")[1].toLowerCase();
        console.log("EXT", extension);
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
          this._imgS.clearQueue();
          return;
        } else {
          this.img = event[0];
          this.preview();
        }
      } else {
        console.log("FILES");
        validExtensions = ["doc", "docx", "pdf"];

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
            console.log(this._trackingS.files);
            if (
              !localStorage.getItem("trackingData") ||
              (this._trackingS.trackingStorage &&
                JSON.parse(localStorage.getItem("trackingData")).documents
                  .length < 3)
            ) {
              const file = event[index];

              if (
                this._trackingS.trackingStorage &&
                JSON.parse(localStorage.getItem("trackingData")).documents
                  .length >= 1
              ) {
                console.log(this._trackingS.trackingStorage);
                console.log(
                  JSON.parse(localStorage.getItem("trackingData")).documents
                    .length
                );

                let existA: number, existS: number;

                existA = this._trackingS.files.findIndex(
                  (e) => e.data.name === event[index].name
                );

                if (localStorage.getItem("trackingData")) {
                  console.log("EXISTS");
                  existS = JSON.parse(
                    localStorage.getItem("trackingData")
                  ).documents.findIndex(
                    (e) => {
                      let doc: string = e.document.split("ads/")[1];
                      let docF = `${doc.split("+@+")[0]}.${doc.split(".")[1]}`;
                      return docF === event[index].name;
                    }
                  );
                }

                if (
                  existA !== -1 ||
                  (localStorage.getItem("trackingData") && existS !== -1)
                ) {
                  console.log("existe");
                  this._notificationsS.message(
                    "error",
                    "El archivo ya existe",
                    "Agrega un documento diferente",
                    false,
                    false,
                    "",
                    "",
                    2000
                  );
                  return;
                } else {
                  this._trackingS.files.push({
                    data: file,
                    inProgress: false,
                    progress: 0,
                  });
                }

                console.log(this._trackingS.files);
              } else {
                this._trackingS.files.push({
                  data: file,
                  inProgress: false,
                  progress: 0,
                });
              }
              console.log(this._trackingS.files);
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
    }

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

  uploadImg() {
    console.log(this.img);
    // return;
    this._imgS.uploader.uploadAll();

    this.subscription = this._updateDS
      .getImg()
      .subscribe((data: { url: string; public_id: string }) => {
        this._usersS
          .updateUser(localStorage.getItem("id"), null, data)
          .subscribe((resp) => {
            if (resp) {
              this._imgS.fileUrl = this._usersS.user.img;
              this.subscription.unsubscribe();
              this.deleteImage();
              $("#modal-File-Upload").modal("close");
            }
          });
      });
  }
}
