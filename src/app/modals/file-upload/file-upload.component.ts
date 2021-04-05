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
  isFileSaved: boolean = false;
  isFileSaving: boolean = false;
  isFormatValid: boolean = true;
  previewUrl: any = null;
  progress: number = 0;
  progressT: number = 0;
  queuedFile: any;
  subscription: Subscription;

  cloudinaryEvidencesQueue: any[] = [];

  ngOnInit() {
    // Init Cloudinary Uploader Options - Image / File
    this._cloudinaryS.uploaderSend();

    // Set Cloudinary Uploader File Type - Image / File
    this._cloudinaryS.setFileUploadType(
      this.dataFile.typeUpload,
      "attachedFile"
    );

    // Get Cloudinary File Uploaded Response
    this.subscriptionsArray.push(
      this._cloudinaryS
        .getFile()
        .subscribe(({ url, public_id, size, name }) => {
          this.createEvidence([{ data: { url, public_id, size, name } }]);
        })
    );

    // Validate Invalid Format Files
    this._cloudinaryS.uploader.onWhenAddingFileFailed = (item, filter) => {
      this._cloudinaryS.formatInvalidError();
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
      this.isFileSaving = true;
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
            this.isFileSaved = true;
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
    this._cloudinaryS.uploadAttachedFilesList.splice(index, 1);
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
    this._cloudinaryS.configurateUploaderBeforeUpload().then((resp) => {
      if (resp) {
        this._cloudinaryS.setFileType("file");
        this._cloudinaryS.uploader.uploadAll();
      } else {
        console.log("Error al configurar el uploader");
      }
    });
  }

  uploadImg() {
    this._cloudinaryS.configurateUploaderBeforeUpload().then((resp) => {
      if (resp) {
        this._cloudinaryS.setFileType("user");
        this._cloudinaryS.uploader.uploadAll();
      } else {
        console.log("Error al configurar el uploader");
      }
    });

    this.subscriptionsArray.push(
      this._cloudinaryS
        .getImg()
        .subscribe((data: { url: string; public_id: string }) => {
          this.subscriptionsArray.push(
            this._usersS
              .updateUser(localStorage.getItem("id"), null, data)
              .subscribe((resp) => {
                if (resp) {
                  this.isFileSaved = true;
                  this._cloudinaryS.fileUrl = this._usersS.user.img;
                  this.deleteImage();
                }
              })
          );
        })
    );
  }
}
