import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

import { Files } from '../../../../models/Files';
import { FilesService } from '../../../../services/files.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

declare var $: any;

@Component({
  selector: 'app-mis-casos',
  templateUrl: './mis-casos.component.html',
  styleUrls: ['./mis-casos.component.css']
})
export class MisCasosComponent implements OnInit {

  constructor(
    private router: Router,
    public _filesS: FilesService
  ) { }

  // Pagination Variables
  currentPage: number = 1;
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  files: Files[];
  filterValue: string;
  selectedEntry: number = 5;

  public config: PerfectScrollbarConfigInterface = {};
  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;

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

    this._filesS.getFiles()
      .subscribe((resp) => {
        this.files = resp.docs;
      })
  }

  // Change Current Pagination Page
  changeEntry($event) {
    this.selectedEntry = $event;
    this.currentPage = 1;
  }

  filter(value: string) {
    if(value.length >= 1 && value !== '')
      this.filterValue = value;
    else
      this.filterValue = '';
  }

  // Navigate To Case Datail
  goToFile(route: any) {
    const url = `/perfil/caso-detalle/${route}`;
    this.router.navigateByUrl(url)
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

}
