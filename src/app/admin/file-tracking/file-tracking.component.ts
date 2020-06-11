import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild
} from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { MatExpansionPanel } from '@angular/material';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { DocumentsViewComponent } from "../../modals/documents-view/documents-view.component";
import { Tracking } from "../../models/Tracking";
import { TrackingService } from "../../services/tracking.service";
import { NotificationsService } from "../../services/notifications.service";
import { UpdateDataService } from "../../services/updateData.service";


declare var $: any;

@Component({
  selector: "app-file-tracking",
  templateUrl: "./file-tracking.component.html",
  styleUrls: ["./file-tracking.component.css"],
})
export class FileTrackingComponent implements OnInit, AfterViewInit {
  constructor(
    private ref: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet,
    public _notificationsS: NotificationsService,
    public _trackingS: TrackingService,
    private _updateDataS: UpdateDataService
  ) { }

  dtOptions: DataTables.Settings = {};
  filesAll: any = [];
  form: FormGroup;
  trackings: Tracking;

  selected = new FormControl(0);
  selectedTrakingAction = new FormControl(0);
  public config: PerfectScrollbarConfigInterface = {};

  ngAfterViewInit() {
    this.ref.detectChanges();
  }

  ngOnInit() {
    this.initFileForm();
    this.getByLowyer();
    this._trackingS.trackingStorage = localStorage.getItem("trackingData")
      ? true
      : false;
    this._trackingS.fileStorage = localStorage.getItem("fileData")
      ? true
      : false;

    if (localStorage.getItem("fileData")) {
      this._trackingS.fileData = localStorage.getItem("fileData")
        ? JSON.parse(localStorage.getItem("fileData"))
        : null;

      this._updateDataS.watchFileStorage().subscribe((data: any) => {
        this._trackingS.fileData = data;
      });
    } else {
      this._updateDataS.watchFileStorage().subscribe((data: any) => {
        this._trackingS.fileData = data;
      });
    }

    if (localStorage.getItem("trackingData")) {
      this.trackings = localStorage.getItem("trackingData")
        ? JSON.parse(localStorage.getItem("trackingData"))
        : null;
      // Get Storage Subscription
      this._updateDataS.watchTrackStorage().subscribe((data: any) => {
        this.trackings = data;
        this._trackingS.trackingStorage = true;
      });
    } else {
      // Get Storage Subscription
      this._updateDataS.watchTrackStorage().subscribe((data: any) => {
        this.trackings = data;
        this._trackingS.trackingStorage = true;
      });
    }

    // Datatable Options
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        infoFiltered: "",
        searchPlaceholder: "Buscar Users",
      },
      scrollY: "calc(100vh - 431px)",
      scrollCollapse: true,
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

  addComment() {
    const comment = this.form.value.commentProgress;

    this._updateDataS.setItemStorage("comment", comment);
  }

  changeStatus(status: string) {
    let action = status === "CLOSED" ? "cerrar" : "reabrir";

    Swal.fire({
      icon: "warning",
      title: `¿Seguro que desea ${action} el expediente: ${this._trackingS.fileData.affair}?`,
      text: `Cliente asignado: ${this._trackingS.fileData.assigned_client[0].firstName} ${this._trackingS.fileData.assigned_client[0].lastName}`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this._updateDataS.setItemStorage("status", status);
        // this._trackingS
        //   .createTracking(this._trackingS.fileData._id, status)
        //   .subscribe((resp) => {
        //     this.reset();
        //   });
      }
    });
  }

  createTracking(file) {

    if (
      localStorage.getItem("trackingData") &&
      JSON.parse(localStorage.getItem("trackingData")).file !== file._id
    ) {
      Swal.fire({
        icon: "warning",
        title: "Seguimiento Activo",
        text: "¿Deseas continuar con el proceso?",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          // this._updateDataS.setItemFile("fileData", JSON.stringify(file));

          this.selected.setValue(1);
        } else {
          console.log("DELETE ACTIVE TRACKING");
          this._trackingS
            .deleteTracking(
              JSON.parse(localStorage.getItem("trackingData"))._id
            )
            .subscribe((resp) => {
              console.log(resp);
              if (resp) {
                this._trackingS.trackingStorage = false;
                localStorage.removeItem("status");
                localStorage.removeItem("comment");
                localStorage.removeItem("trackingData");
                this._updateDataS.setItemFile("fileData", JSON.stringify(file));
                this.selected.setValue(1);
              }
            });
        }
      });
    } else {
      this._updateDataS.setItemFile("fileData", JSON.stringify(file));
      this.selected.setValue(1);
    }
  }

  deleteDoc(id: string) {
    // console.log(id)
    this._trackingS
      .deleteTrackingDoc(JSON.parse(localStorage.getItem("trackingData"))._id, id)
      .subscribe((resp: any) => {
        this._updateDataS.setItemTrack(
          "trackingData",
          JSON.stringify(resp.tracking)
        );
        // console.log(resp)
      });
  }

  deleteFile(index: number) {
    this._trackingS.files.splice(index, 1);
  }

  finish() {
    if (localStorage.getItem("fileData")) {
      this._updateDataS.setItemStorage("status", 'FINALIZADO');
      if (localStorage.getItem("trackingData")) {
        this._trackingS
          .updateTracking(JSON.parse(localStorage.getItem("trackingData"))._id)
          .subscribe((resp) => {
            this.reset();
          });
      } else {
        this._trackingS
          .createTracking(JSON.parse(localStorage.getItem("fileData"))._id)
          .subscribe((resp) => {
            this.reset();
          });
      }
    }
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

  openDocuments(documents) {
    this.bottomSheet.open(DocumentsViewComponent, {
      data: { documents },
    });
  }

  reset() {
    if (localStorage.getItem("fileData")) {

      this._notificationsS.message(
        "success",
        `Seguimiento #${
        JSON.parse(localStorage.getItem("fileData")).tracks.length + 1
        } Finalizado`,
        `Cliente: ${
        JSON.parse(localStorage.getItem("fileData")).assigned_client[0]
          .firstName
        } ${
        JSON.parse(localStorage.getItem("fileData")).assigned_client[0].lastName
        }           Expediente: ${
        JSON.parse(localStorage.getItem("fileData")).affair
        }`,
        false,
        true,
        "Aceptar",
        ""
      );
    }
    this.getByLowyer();
    this.selected.setValue(0);
    this.form.reset();
    this._trackingS.reset();
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }
}
