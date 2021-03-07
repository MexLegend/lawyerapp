import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { EvidencesService } from "src/app/services/evidences.service";

@Component({
  selector: "app-file-preview",
  templateUrl: "./file-preview.component.html",
  styleUrls: ["./file-preview.component.css"],
})
export class FilePreviewComponent implements OnInit, AfterViewInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    public _evidencesS: EvidencesService,
    private renderer: Renderer2
  ) {}

  documentPath: any;
  documentName: string;
  iframeSrc: any;
  showIframe: boolean = false;
  timeInterval: any;

  @ViewChild("iframePreview", {static: false}) iframePreview: ElementRef;

  ngOnInit() {
    if (this.data !== null) {
      this.documentName = this.data.name;

      if (
        this._evidencesS.formatType(this.documentName.split(".").pop()) ===
        "image"
      ) {
        this.showIframe = true;
        this.documentPath = this.data.path;
      } else {
        this.documentPath = this.getIframeLink();
      }
    }
  }

  ngAfterViewInit() {
    if (
      this._evidencesS.formatType(this.documentName.split(".").pop()) !==
      "image"
    ) {
      this.renderer.listen(this.iframePreview.nativeElement, "load", () => {
        this.showIframe = true;
      });

      if (!this.showIframe) {
        this.timeInterval = setInterval(() => {
          this.reloadIframe();
        }, 1000);
      }
    }
  }

  reloadIframe() {
    if (this.showIframe) {
      clearInterval(this.timeInterval);
    }
  }

  getIframeLink(): any {
    let url: any;

    url = this.documentPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://drive.google.com/viewerng/viewer?url=${this.data.path}&hl=en&pid=explorer&efh=false&a=v&chrome=false&embedded=true`
    );

    return url;
  }
}
