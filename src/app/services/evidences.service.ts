import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UsersService } from "./users.service";
import { environment } from "../../environments/environment";
import { Observable, throwError, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { NotificationsService } from "./notifications.service";
import { Evidence, EvidencesPagination } from "../models/Evidence";
import { CloudinaryService } from "./cloudinary.service";
import { LocalStorageService } from "./local-storage.service";
import { saveAs } from "file-saver";

@Injectable({
  providedIn: "root",
})
export class EvidencesService {
  constructor(
    private http: HttpClient,
    public _cloudinaryS: CloudinaryService,
    public _localStorageS: LocalStorageService,
    public _notificationsS: NotificationsService,
    private _usersS: UsersService
  ) {}

  private checkEvidences = new Array<any>();
  private isLocalStorageLoaded: boolean = false;
  private localStorageItemsLength: number = 1;
  private selectedEvidences: any[] = [];
  caseId: string;
  disableCancelUpload: boolean = false;
  evidences: any[] = [];
  noteSelected: any;
  progressF: number = 0;
  progressT: number = 0;
  tempCheckedEvidences: any[] = [];

  public emitEvidence = new EventEmitter<any>();

  private caseIdSub = new Subject<any>();
  private selectedEvidencesSub = new Subject<any>();

  // Get checked evidences after handler button clicked
  getShowingCheckedEvidences(): any[] {
    return this.selectedEvidences;
  }

  // Set checked evidences after handler button clicked
  setShowingListedEvidences(isInLocalStorage?: boolean) {
    this.setSelectedEvidencesSub(this.checkEvidences);
    this.selectedEvidences = this.checkEvidences;

    if (!isInLocalStorage && this.checkEvidences.length > 0) {
      this._localStorageS.addLocalStorageItem("evidences", this.checkEvidences);
    } else if (this.checkEvidences.length === 0) {
      this._localStorageS.deleteLocalStorageProperty(["evidences"]);
    }
    this.tempCheckedEvidences = this.checkEvidences;
  }

  // Get checked/selected evidences subscription
  getSelectedEvidencesSub(): Observable<any> {
    return this.selectedEvidencesSub.asObservable();
  }

  // Set checked/selected evidences subscription
  setSelectedEvidencesSub(checkedEvidences: any) {
    this.selectedEvidencesSub.next(checkedEvidences);
  }

  // Get Checked Evidences When Evidences Component Its Called
  getCurrentCheckedEvidences() {
    this.tempCheckedEvidences = this.checkEvidences;
  }

  // Update existing checked evidences
  setCheckEvidences(evidenceObteined: any, action: string) {
    // Add Checked Evidences To Array When Isn't Local Storage
    if (action === "check") {
      this.checkEvidences = [...this.checkEvidences, evidenceObteined];
    } else {
      const tempSelectedEvidences = this.checkEvidences.filter((evidence) => {
        return evidence._id !== evidenceObteined._id;
      });
      this.checkEvidences = tempSelectedEvidences;
    }
  }

  // Add Checked Evidences To Array From Local Storage
  setCheckEvidencesFromStorage(evidencesArrayObteined: any[]) {
    const tempEvidencesArrayObteined = evidencesArrayObteined.map(
      (evidenceObteined) => {
        return evidenceObteined;
      }
    );

    this.checkEvidences = tempEvidencesArrayObteined;
  }

  getCaseIdSub(): Observable<any> {
    return this.caseIdSub.asObservable();
  }

  setCaseIdSub(modeV: string, key?: string, caseData?: any) {
    localStorage.setItem(key, JSON.stringify(caseData));

    // let caseId = modeV === "list" ? caseData._id : JSON.parse(localStorage.getItem('caseData'))._id;
    this.caseIdSub.next({ modeV, caseId: caseData._id });
  }

  // Normal Functions

  clearCheckEvidences() {
    this.checkEvidences = [];
    this.setShowingListedEvidences();
  }

  clearNotListedEvidences() {
    this.checkEvidences = this.tempCheckedEvidences;
  }

  changeStatusEvidence(
    idCase: string,
    idEvidence: string,
    statusN: string
  ): Observable<Evidence> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/evidences/status/${idCase}/${idEvidence}`;

    const data =
      statusN === "DELETED"
        ? {
            deleted: "DELETED",
          }
        : {
            status: statusN,
          };

    return this.http
      .put<Evidence>(url, data, { headers })
      .pipe(
        map((resp: any) => {
          this._notificationsS.message(
            "success",
            `${resp.deleted ? "Eliminación correcta" : "Estado actualizado"}`,
            resp.message,
            false,
            false,
            "",
            "",
            2000
          );
          return resp;
        })
      );
  }

  createEvidence(idCase: any, evidences: any[]) {
    const url = `${environment.URI}/api/evidences/${idCase}`;
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });
    let data = [];

    evidences.forEach((evidence) => {
      data = [...data, evidence.data];
    });

    return this.http.post(url, data, { headers }).pipe(
      map((resp: any) => {
        this._notificationsS.message(
          "success",
          "Evidencia agregada correctamente",
          false,
          false,
          false,
          "",
          "",
          2000
        );
        this._cloudinaryS.clearQueue();
        return resp;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  deleteListedEvidence(idEvidence: string) {
    const evidencesN = JSON.parse(localStorage.getItem("evidences")).filter(
      (evidenceS) => {
        return evidenceS._id !== idEvidence;
      }
    );

    return evidencesN;
  }

  deleteEvidence(idCase: string, idEvidence: string): Observable<Evidence> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/evidences/temp/${idCase}/${idEvidence}`;

    return this.http
      .delete<Evidence>(url, { headers })
      .pipe(
        map((resp: any) => {
          this._notificationsS.message(
            "success",
            "Eliminación correcta",
            resp.message,
            false,
            false,
            "",
            "",
            2000
          );
          return resp;
        })
      );
  }

  downloadEvidence(url, format: string) {
    if (format === "pdf") {
      let headers = new HttpHeaders();
      headers = headers.set("Accept", "application/pdf");
      this.http
        .get(`${url}`, {
          headers: headers,
          responseType: "blob" as "blob",
        })
        .subscribe((response: any) => {
          var blob = new Blob([response]);
          saveAs(blob, url);
        });
    } else {
      window.open(`${url}`);
    }
  }

  /**
   * Parse File Size
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals?) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  formatType(format: string): string {
    const imgExtensions = ["png", "jpg", "jpeg", "gif", "webp", "jfif"];
    const wordExtensions = ["doc", "docx"];

    if (imgExtensions.includes(format.toLowerCase())) {
      return "image";
    } else if (wordExtensions.includes(format.toLowerCase())) {
      return "word";
    } else {
      return "pdf";
    }
  }

  getEvidence(id: string): Observable<Evidence> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/evidences/${id}`;

    return this.http
      .get<Evidence>(url, { headers })
      .pipe(map((resp: any) => resp.evidence));
  }

  getEvidences(
    caseId: string,
    page: number = 0,
    perPage: number = 10,
    orderField?: string,
    orderType?: number,
    filter?: string,
    filterOpt?: string,
    status?: string
  ): Observable<EvidencesPagination> {
    let url = `${
      environment.URI
    }/api/evidences/all/${caseId}?status=${status}&page=${
      page + 1
    }&perPage=${perPage}`;

    if (orderField && orderType) {
      url = `${url}&orderField=${orderField}&orderType=${orderType}`;
    }

    if (filterOpt) {
      url = `${url}&filterOpt=${filterOpt}`;
    }

    if (filter) {
      url = `${url}&filter=${filter}`;
    }

    return this.http
      .get<EvidencesPagination>(url)
      .pipe(map((resp: any) => resp.evidences));
  }

  isLocalStorageLoadedFn(isLocalStorage?: boolean) {
    if (isLocalStorage && !this.isLocalStorageLoaded) {
      this.isLocalStorageLoaded = true;
    } else {
      this.isLocalStorageLoaded = false;
      this.localStorageItemsLength = this.localStorageItemsLength + 1;
    }
    return this.isLocalStorageLoaded;
  }

  progressUpload(res) {
    if (res.loaded && res.total) {
      this.progressT = Math.round(
        (Number(res.loaded) / Number(res.total)) * 100
      );
      this.progressF = Math.round(
        (Number(res.loaded) / Number(res.total)) * 100
      );
    }

    if (res.body) {
      setTimeout(() => {
        this.disableCancelUpload = false;
        this.evidences = [];
        this.progressT = 0;
        this.progressF = 0;
        localStorage.removeItem("documents");
      }, 2000);
    }
  }

  updateEvidence(idCase, note: any) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });
    const noteU = {
      affair: note.noteAffair,
      message: note.noteMessage,
      status: note.noteStatus,
      _id: note._id,
    };
    const url = `${environment.URI}/api/evidences/${idCase}/${note._id}`;

    return this.http.put(url, noteU, { headers }).pipe(
      map((resp: any) => {
        this._notificationsS.message(
          "success",
          "Nota editada correctamente",
          false,
          false,
          false,
          "",
          "",
          2000
        );
        return true;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
