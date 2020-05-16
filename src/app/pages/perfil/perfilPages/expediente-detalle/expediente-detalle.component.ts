import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

import { Files } from '../../../../models/Files';
import { FilesService } from '../../../../services/files.service';
import { TrackingService } from '../../../../services/tracking.service';
import { Tracking } from '../../../../models/Tracking';

@Component({
  selector: "app-expediente-detalle",
  templateUrl: "./expediente-detalle.component.html",
  styleUrls: ["./expediente-detalle.component.css"],
})
export class ExpedienteDetalleComponent implements OnInit {
  file: Files;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();
  trackings: Tracking[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public _filesS: FilesService,
    public _trackingS: TrackingService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const id = params["id"];
      this.dtTrigger.next();
      if (id !== "new") {
        this.load(id);
      }
    });

    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 6,
      responsive: true,
      lengthChange: false,
      bFilter: false,
      language: {
        infoFiltered: "",
      },
      scrollCollapse: true,
      fixedColumns: true,
    };
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  load(id: string) {
    this._filesS.getFile(id).subscribe((file: Files) => {
      console.log(file);
      this.file = file;

      if (file && file !== null) {
        this._trackingS.getTrackings(file._id).subscribe((resp) => {
          console.log(resp.docs);
          this.trackings = resp.docs;
        });
      }
    });
  }
}
