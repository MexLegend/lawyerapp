import { Component, OnInit, Input, Inject } from "@angular/core";
import { CloudinaryService } from "../../services/cloudinary.service";
import { FileUploader } from "ng2-file-upload";
import { UsersService } from "../../services/users.service";
import { UpdateDataService } from "../../services/updateData.service";
import { NotificationsService } from "../../services/notifications.service";
import { TrackingService } from "../../services/tracking.service";
import { Subscription } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { EvidencesService } from "../../services/evidences.service";

declare var $: any;

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<FileUploadComponent>,
    public _evidencesS: EvidencesService,
    public _trackingS: TrackingService,
    public _cloudinaryS: CloudinaryService,
    public _notificationsS: NotificationsService,
    public _updateDS: UpdateDataService,
    public _usersS: UsersService,
    @Inject(MAT_DIALOG_DATA) public dataFile: any
  ) {}

  subscriptionsArray: Subscription[] = [];

  public hasBaseDropZoneOver = false;

  file: File;
  fileData: any = [];
  img: any = null;
  isFormatValid: boolean = true;
  previewUrl: any = null;
  progress: number = 0;
  progressT: number = 0;
  queuedFile: any;
  subscription: Subscription;

  cloudinaryEvidencesQueue: any[] = [];

  ngOnInit() {
    // Init Cloudinary Uploader Options - Img / Evidences
    this._cloudinaryS.uploaderSend(this.dataFile.typeUpload);
    // Get Cloudinary File Uploaded Response
    this.subscriptionsArray.push(
      this._cloudinaryS
        .getFile()
        .subscribe(({ url, public_id, size, name }) => {
          this.createEvidence([{ data: { url, public_id, size, name } }]);
        })
    );

    // Validate Duplicated Queue Files
    this._cloudinaryS.uploader.onAfterAddingFile = (item) => {
      item.remove();
      if (
        this._cloudinaryS.uploader.queue.filter(
          (f) => f._file.name == item._file.name
        ).length == 0
      ) {
        this._cloudinaryS.uploader.queue.push(item);
      } else {
        this._cloudinaryS.duplicatedFileError(item._file.name);
      }
    };

    // Validate Invalid Format Files
    this._cloudinaryS.uploader.onWhenAddingFileFailed = (item, filter) => {
      // let message = '';
      // switch (filter.name) {
      //   case 'queueLimit':
      //     message = 'Permitido o envio de no máximo ' + queueLimit + ' arquivos';
      //     break;
      //   case 'fileSize':
      //     message = 'O arquivo ' + item.name + ' possui ' + formatBytes(item.size) + ' que ultrapassa o tamanho máximo permitido de ' + formatBytes(maxFileSize);
      //     break;
      //   default:
      //     message = 'Erro tentar incluir o arquivo';
      //     break;

      this._cloudinaryS.formatInvalidError(this.dataFile.typeUpload);
    };

    this.subscriptionsArray.push(
      this._updateDS.watchTrackStorage().subscribe()
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Send Queued Files
  addDocuments() {
    if (this._cloudinaryS.uploader.queue.length > 0) {
      this.uploadFilesCloudinary();
    }
  }

  createEvidence(evidence: any) {
    this._evidencesS.disableCancelUpload = true;

    this.cloudinaryEvidencesQueue = [
      ...this.cloudinaryEvidencesQueue,
      evidence[0],
    ];

    if (this._cloudinaryS.uploader.getNotUploadedItems().length === 0) {
      let idCase = localStorage.getItem("caseData")
        ? JSON.parse(localStorage.getItem("caseData"))._id
        : null;

      this.subscriptionsArray.push(
        this._evidencesS
          .createEvidence(idCase, this.cloudinaryEvidencesQueue)
          .subscribe(() => {
            this._evidencesS.setCaseIdSub(
              "new",
              "caseData",
              JSON.parse(localStorage.getItem("caseData"))
            );
            this.closeModal();
            this.cloudinaryEvidencesQueue = [];
          })
      );
    }
  }

  closeModal() {
    this._cloudinaryS.uploader.clearQueue();
    this.dialogRef.close();
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this._cloudinaryS.uploader.queue.splice(index, 1);
  }

  deleteImage() {
    this.previewUrl = null;
    this._cloudinaryS.clearQueue();
  }

  public onFileSelected($event) {
    return;
  }

  preview() {
    var reader = new FileReader();
    reader.readAsDataURL(this.img);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  uploadFilesCloudinary() {
    this._cloudinaryS.setFileType("file");
    this._cloudinaryS.uploader.uploadAll();
  }

  uploadImg() {
    this._cloudinaryS.setFileType("user");
    this._cloudinaryS.uploader.uploadAll();

    this.subscriptionsArray.push(
      this._cloudinaryS
        .getImg()
        .subscribe((data: { url: string; public_id: string }) => {
          this.subscriptionsArray.push(
            this._usersS
              .updateUser(localStorage.getItem("id"), null, data)
              .subscribe((resp) => {
                if (resp) {
                  this._cloudinaryS.fileUrl = this._usersS.user.img;
                  this.deleteImage();
                }
              })
          );
        })
    );
  }
}
