import { Component, OnInit, HostListener } from '@angular/core';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FormControl } from "@angular/forms";
import { Files } from '../../models/Files';

@Component({
  selector: 'app-evidences',
  templateUrl: './evidences.component.html',
  styleUrls: ['./evidences.component.css']
})
export class EvidencesComponent implements OnInit {

  constructor() { }

  files: Files[] = [];
  fileData: any;

  selected = new FormControl(0);
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
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  // View Files List Function
  viewFilesList(data: any) {
    this.fileData = data;
  }

}
