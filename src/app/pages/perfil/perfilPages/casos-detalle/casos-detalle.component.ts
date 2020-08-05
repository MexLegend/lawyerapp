import { Component, OnInit, HostListener } from '@angular/core';
import {
  MatBottomSheet
} from "@angular/material/bottom-sheet";
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

import { Files } from '../../../../models/Files';
import { FilesService } from '../../../../services/files.service';
import { TrackingService } from '../../../../services/tracking.service';
import { Tracking } from '../../../../models/Tracking';
import { DocumentsViewComponent } from '../../../../modals/documents-view/documents-view.component';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: "app-casos-detalle",
  templateUrl: "./casos-detalle.component.html",
  styleUrls: ["./casos-detalle.component.css"],
})
export class CasosDetalleComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    public _filesS: FilesService,
    public _trackingS: TrackingService
  ) { }

  file: Files;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();
  trackings: Tracking[] = [];

  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};

  // Detect Real Screen Size
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerScreenWidth = window.innerWidth;
    if (this.innerScreenWidth > 520) {
      this.mobileFilterActivated = false;
    }
  }

  ngOnInit() {
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

    this.activatedRoute.params.subscribe((params) => {
      const id = params["id"];
      this.dtTrigger.next();
      if (id !== "new") {
        this.load(id);
      }
    });

    // this.dtOptions = {
    //   pagingType: "simple_numbers",
    //   pageLength: 6,
    //   responsive: true,
    //   lengthChange: false,
    //   bFilter: false,
    //   language: {
    //     "infoFiltered": ""
    //   },
    //   scrollCollapse: true,
    //   scrollY: "calc(100vh - 631px)"
    // };
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

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  openDocuments(documents) {
    this.bottomSheet.open(DocumentsViewComponent, {
      data: { documents }
    });
  }
}
