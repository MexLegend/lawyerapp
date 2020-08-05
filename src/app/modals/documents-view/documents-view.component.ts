import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TrackingService } from 'src/app/services/tracking.service';

@Component({
  selector: 'app-documents-view',
  templateUrl: './documents-view.component.html',
  styleUrls: ['./documents-view.component.css']
})
export class DocumentsViewComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public _trackingS: TrackingService
  ) {}

  documents: any;

  ngOnInit() {
    console.log(this.data);
    if(this.data !== null) {
      this.documents = this.data.documents;
    }
  }

  open(url) {
    if (url.indexOf("pdf") >= 0) {
      console.log(url)
      this._trackingS.downloadPDF(url)
    } else {
      console.log('DOC')
      window.open(`https://${url}`);
    }
  }

}
