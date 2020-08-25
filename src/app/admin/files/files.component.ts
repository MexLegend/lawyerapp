import {
  Component, OnInit, HostListener, ChangeDetectorRef
} from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from "@angular/forms";
import { Files } from '../../models/Files';
import { FilesService } from '../../services/files.service';
import { UpdateDataService } from '../../services/updateData.service';
import { FilesFormComponent } from '../../modals/files-form/files-form.component';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public _filesS: FilesService,
    public _notesS: NotesService,
    public _updateDS: UpdateDataService,
    private ref: ChangeDetectorRef
  ) { }

  currentPage: number = 1;
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  files: Files[] = [];
  fileData: any;
  filterValue: string;
  selected = new FormControl(0);
  selectedEntry: number = 5;

  notes: any;

  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerScreenWidth = window.innerWidth;
    if (this.innerScreenWidth > 520) {
      this.mobileFilterActivated = false;
    }
  }

  ngOnInit() {
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

    this._filesS.getFiles().subscribe((resp) => {
      console.log(resp);
      this.files = resp.docs;
    });

    this._filesS.notifica.subscribe((r) => {
      this.load();
    });

    this._notesS.notificaNote.subscribe((resp) => {

      if (resp.tab) {
        this.selected.setValue(0);
      }
    })
  }

  ngAfterViewInit() {
    this.ref.detectChanges();
  }

  // Change Current Pagination Page
  changeEntry($event) {
    this.selectedEntry = $event;
    this.currentPage = 1;
  }

  clicked(tabChangeEvent: any): void {
    console.log(tabChangeEvent.index);
  }

  delete(file: Files) {
    Swal.fire({
      icon: "warning",
      title: "¿Esta seguro?",
      text: "Esta a punto de borrar el expediente " + file.affair,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this._filesS.deleteFile(file._id).subscribe(() => {
          this.load();
        });
      }
    });
  }

  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  generateKey() {
    // Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
    const allNumbers = [..."0123456789"];

    const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];

    const generator = (base, len) => {
      return [...Array(len)]
        .map((i) => base[(Math.random() * base.length) | 0])
        .join("");
    };

    document.getElementsByClassName("clave-generada")[0].innerHTML = generator(
      base,
      12
    );
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  load() {
    this._filesS.getFiles().subscribe((resp) => {
      console.log(resp.docs);
      this.files = resp.docs;
    });
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  // Open Files Modal
  openFilesModal(idFile?: any) {
    let dialogRef =
      idFile && idFile !== ""
        ? this.dialog.open(FilesFormComponent, {
          data: { idFile, action: "Actualizar" },
          autoFocus: false,
        })
        : this.dialog.open(FilesFormComponent, {
          data: { action: "Crear" },
          autoFocus: false,
        });

    dialogRef.afterClosed().subscribe((result) => {
      localStorage.removeItem("userData");
      localStorage.removeItem("fileData");
      this._updateDS.setUserData(null);
    });
  }

  sendId(id: string, action: string) {
    this._updateDS.sendFileId(id, action);
  }

  // View Files List Function
  viewFilesList(data: any) {
    console.log(data)
    this.fileData = data;
    this._notesS.caseId = data._id;
    this._updateDS.setItemFile('fileData', JSON.stringify(data))
  }

  setCaseId(idCase: string) {
    console.log(idCase);

    this._notesS.setCaseIdSub("new", idCase);
  }
}