import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from "@angular/core";
import {
  MatBottomSheet
} from "@angular/material/bottom-sheet";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { UpdateDataService } from "../../services/updateData.service";
import { TrackingService } from "../../services/tracking.service";
import { Tracking } from "../../models/Tracking";
import { NotificationsService } from "../../services/notifications.service";
import { DocumentsViewComponent } from '../../modals/documents-view/documents-view.component';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

declare var $: any;

@Component({
  selector: "app-file-tracking",
  templateUrl: "./file-tracking.component.html",
  styleUrls: ["./file-tracking.component.css"],
})
export class FileTrackingComponent implements OnInit, AfterViewInit {
  constructor(
    private ref: ChangeDetectorRef,
    public _notificationsS: NotificationsService,
    public _trackingS: TrackingService,
    private _updateDataS: UpdateDataService,
    private bottomSheet: MatBottomSheet,
  ) { }

  dtOptions: DataTables.Settings = {};
  public fileData: any = "";
  filesAll: any = [];
  form: FormGroup;
  trackings: Tracking;
  public userData: any = "";
  trackingStorage: any;
  userStorage: any;
  fileStorage: any;
  selected = new FormControl(0);
  selectedTrakingAction = new FormControl(0);
  public config: PerfectScrollbarConfigInterface = {};

  ngAfterViewInit() {
    this.ref.detectChanges();
  }

  ngOnInit() {
    this.initFileForm();
    this.getByLowyer()
    this.trackingStorage = localStorage.getItem("trackingData") ? true : false;
    this.userStorage = localStorage.getItem("userData") ? true : false;
    this.fileStorage = localStorage.getItem("fileData") ? true : false;

    if (localStorage.getItem("userData")) {
      this.userData = localStorage.getItem("userData")
        ? JSON.parse(localStorage.getItem("userData"))
        : null;
      this._updateDataS.watchUserStorage().subscribe((data: any) => {
        console.log(data);
        this.userData = data;
      });
    } else {
      // Get UserData Subscription
      this._updateDataS.getUserData("seguimiento").subscribe((data) => {
        if (data !== "") {
          this._updateDataS.setItemUser("userData", JSON.stringify(data));
          this.userData = data;
        }
      });
    }

    if (localStorage.getItem("fileData")) {
      this.fileData = localStorage.getItem("fileData")
        ? JSON.parse(localStorage.getItem("fileData"))
        : null;
      this._updateDataS.watchFileStorage().subscribe((data: any) => {
        this.fileData = data;
      });
    } else {
      // Get FileData Subscription
      this._updateDataS.getFileData().subscribe((data: any) => {
        if (data !== "" && data !== null) {
          this._updateDataS.setItemFile("fileData", JSON.stringify(data));
          this.fileData = data;
        }
      });
    }

    if (localStorage.getItem("trackingData")) {
      this.trackings = localStorage.getItem("trackingData")
        ? JSON.parse(localStorage.getItem("trackingData"))
        : null;
      // Get Storage Subscription
      this._updateDataS.watchTrackStorage().subscribe((data: any) => {
        this.trackings = data;
        this.trackingStorage = true;
      });
    } else {
      // Get Storage Subscription
      this._updateDataS.watchTrackStorage().subscribe((data: any) => {
        this.trackings = data;
        this.trackingStorage = true;
      });
    }

    // Datatable Options
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar Users"
      },
      scrollY: "calc(100vh - 431px)",
      scrollCollapse: true
    };

    $(document).ready(function () {
      // Tabs Initiation
      $(".tabs").tabs();

      // Clients Modal Initiation
      $("#selectUser").modal({
        onOpenEnd: function () {
          var table = $("#select-users-tbl").DataTable();
          table.columns.adjust().draw();
        },
      });

      //  Files Modal Initiation
      $("#selectFile").modal({
        onOpenEnd: function () {
          var table = $("#select-files-tbl").DataTable();
          table.columns.adjust().draw();
        },
      });

      $("#modal-File-Upload").modal();
    });
  }

  changeStatus(status: string) {
    let action = status === "CLOSED" ? "cerrar" : "reabrir";

    Swal.fire({
      icon: "warning",
      title: `¿Seguro que desea ${action} el expediente: ${this.fileData.affair}?`,
      text: `Cliente asignado: ${this.userData.firstName} ${this.userData.lastName}`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this._trackingS
          .createTracking(this.fileData._id, status)
          .subscribe((resp) => {
            this.reset();
          });
      }
    });
  }

  deleteDoc(id: string) {
    // console.log(id)
    this._trackingS.deleteTrackingDoc(localStorage.getItem('trackingDOC'), id)
      .subscribe((resp: any) => {
        this._updateDataS.setItemTrack('trackingData', JSON.stringify(resp.tracking))
        // console.log(resp)
      })
  }

  finish() {
    this._notificationsS.message(
      "success",
      `Seguimiento #${this.trackings.track} Finalizado`,
      `Cliente: ${this.userData.firstName} ${this.userData.lastName}           Expediente: ${this.fileData.affair}`,
      false,
      true,
      "Aceptar",
      ""
    );
    this.trackingStorage = false;
    this.fileStorage = false;
    this.userStorage = false;
    this.reset();

  }

  getByLowyer() {
    this._trackingS.getByLowyer().subscribe((resp) => {
      console.log(resp);
      this.filesAll = resp;
    });
  }

  private initFileForm() {
    this.form = new FormGroup({
      commentProgress: new FormControl(null, Validators.required),
    });
  }

  open(url) {
    window.open(`http://${url}`, "_blank");
  }

  reset() {
    localStorage.removeItem("tracking");
    localStorage.removeItem("trackingDOC");
    localStorage.removeItem("trackingData");
    localStorage.removeItem("fileData");
    localStorage.removeItem("userData");
    this._updateDataS.setFileData(null);
    this._updateDataS.setUserData(null);

    console.log(this.userData);
    console.log(this.fileData);
    console.log(this.trackingStorage);


  }

  send() {
    const comments = {
      comment: this.form.value.commentProgress,
    };

    if (localStorage.getItem("tracking")) {
      this._trackingS
        .updateTracking(localStorage.getItem("trackingDOC"), comments)
        .subscribe((resp) => {
          if (resp) {
            this.form.reset();
          }
        });
    } else {
      this._trackingS
        .createTracking(this.fileData._id, comments)
        .subscribe((resp) => {
          if (resp) {
            localStorage.setItem("tracking", JSON.stringify(true));
            if (resp.body) {
              localStorage.setItem("trackingDOC", resp.body.tracking._id);
            }
            this.form.reset();
          }
        });
    }
  }

  // Send Action to Update Data Service
  updateDataServiceAction() {
    this._updateDataS.dataServiceAction("seguimiento");
  }

  openDocuments(documents) {
    this.bottomSheet.open(DocumentsViewComponent, {
      data: { documents }
    });
  }
}
