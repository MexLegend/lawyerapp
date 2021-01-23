import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable, throwError, Subject } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { NotificationsService } from "./notifications.service";
import { UsersService } from "./users.service";
import { TrackingsPagination, Tracking } from "../models/Tracking";
import { UpdateDataService } from "./updateData.service";

import Swal from "sweetalert2";
import { LocalStorageService } from "./local-storage.service";
import { EvidencesService } from "./evidences.service";
import { NotesService } from "./notes.service";
import { VolumesService } from "./volumes.service";

declare var $: any;

@Injectable({
  providedIn: "root",
})
export class TrackingService {
  constructor(
    private _evidencesS: EvidencesService,
    private _notesS: NotesService,
    private http: HttpClient,
    public _localStorageS: LocalStorageService,
    public _notificationsS: NotificationsService,
    public _updateDataS: UpdateDataService,
    private _usersS: UsersService,
    public _volumesS: VolumesService
  ) {}

  public caseData: any = "";

  private currentCaseDataSub = new Subject<any>();
  private currentCaseVolumesSub = new Subject<any>();
  private currentTrackIndexSub = new Subject<any>();
  private casesDataSub = new Subject<any>();
  public notifica = new EventEmitter<any>();
  private trackIdSub = new Subject<any>();
  private trackingMessageSub = new Subject<any>();
  private activeCaseTabSub = new Subject<any>();

  getActiveCaseTabSub(): Observable<any> {
    return this.activeCaseTabSub.asObservable();
  }

  setActiveCaseTabSub(activeCaseTab: any) {
    this.activeCaseTabSub.next(activeCaseTab);
  }

  getCurrentTrackIndexSub(): Observable<any> {
    return this.currentTrackIndexSub.asObservable();
  }

  setCurrentTrackIndexSub(index: number) {
    this.currentTrackIndexSub.next(index);
  }

  getTrackIdSub(): Observable<any> {
    return this.trackIdSub.asObservable();
  }

  setTrackIdSub(track: any, action: string) {
    this.trackIdSub.next({ track, action });
  }

  getTrackingMessageValueSub(): Observable<any> {
    return this.trackingMessageSub.asObservable();
  }

  setTrackingMessageValueSub(value: string) {
    this.trackingMessageSub.next(JSON.stringify(value));
  }

  getCasesDataSub(): Observable<any> {
    return this.casesDataSub.asObservable();
  }

  setCasesDataSub(casesData: any) {
    this.casesDataSub.next(casesData);
  }

  getCurrentCaseDataSub(): Observable<any> {
    return this.currentCaseDataSub.asObservable();
  }

  setCurrentCaseDataSub(currentCaseData: any) {
    this.currentCaseDataSub.next(currentCaseData);
  }

  getCurrentCaseVolumesSub(): Observable<any> {
    return this.currentCaseVolumesSub.asObservable();
  }

  setCurrentCaseVolumesSub(currentCaseVolumes: any) {
    this.currentCaseVolumesSub.next(currentCaseVolumes);
  }

  changeStatusTracking(idTrack: string, status: any): Observable<Tracking> {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/trackings/status/${idTrack}`;

    return this.http
      .put<Tracking>(url, status, { headers })
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  getAll(id: string): Observable<Tracking[]> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/trackings/all/${id}`;

    return this.http
      .get<Tracking[]>(url, { headers })
      .pipe(map((resp: any) => resp.trackings));
  }

  getByClient(idCase?: string, idClient?: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/trackings/client/${idCase}/${idClient}`;

    return this.http.get(url, { headers }).pipe(
      map((resp: any) => {
        return resp.cases;
      })
    );
  }

  getByLowyer(): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/trackings/lawyer/all`;

    return this.http.get(url, { headers }).pipe(map((resp: any) => resp.cases));
  }

  // Get Tracking Volumes List
  getVolumes(volumes: any) {
    let tempVolumesArray: any[] = [];
    const [last] = volumes.slice(-1);
    volumes.map((volume) => {
      this._volumesS.setVolumeSub("volume", last._id);
      tempVolumesArray = [...tempVolumesArray, volume];
    });
    this.setCurrentCaseVolumesSub([tempVolumesArray, last._id]);
  }

  // Normal Functions

  callTrackingCreationSwalModal(
    trackingActionMessage: string,
    currentCaseData: any
  ) {
    Swal.fire({
      icon: "warning",
      title: "¡ADVERTENCIA!",
      html:
        `${trackingActionMessage}` +
        "Si continuas perderás los avances de dicho evento.<br> ¿Deseas continuar?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#f8b407",
      cancelButtonColor: "#f8b407",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      // Validate If "No" Modal Button Clicked And Load Data Of Current LocalStorage Case
      if (!result.value) {
        this.getVolumes(
          JSON.parse(localStorage.getItem("trackingCaseData")).volumes
        );

        this._localStorageS
          .getLocalStoragePropertyIfExists(["trackingCaseData"])
          .map((item) => {
            this.setCurrentCaseDataSub(JSON.parse(item.trackingCaseData));
            this.setTrackIdSub(
              JSON.parse(item.trackingCaseData).tracks,
              "list"
            );
          });

        this.setActiveCaseTabSub(4);
        // Validate If "Si" Modal Button Clicked And Delete Current LocalStorage Case
      } else {
        this.resetCaseData();
        this._localStorageS.addLocalStorageItem(
          "trackingCaseData",
          currentCaseData
        );
        this.setActiveCaseTabSub(4);
      }
    });
  }

  callTrackingUpdateSwalModal(
    trackingActionMessage: string,
    currentCaseData: any,
    trackingData: any
  ) {
    Swal.fire({
      icon: "warning",
      title: "¡ADVERTENCIA!",
      html:
        `${trackingActionMessage}` +
        "Si continuas perderás los avances de dicho evento.<br> ¿Deseas continuar?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#f8b407",
      cancelButtonColor: "#f8b407",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      // Validate If "No" Modal Button Clicked And Then Load Data Of Current LocalStorage Case
      if (!result.value) {
        this.getVolumes(
          JSON.parse(localStorage.getItem("trackingCaseData")).volumes
        );

        this._localStorageS
          .getLocalStoragePropertyIfExists(["trackingCaseData"])
          .map((item) => {
            this.setCurrentCaseDataSub(JSON.parse(item.trackingCaseData));
            this.setTrackIdSub(
              JSON.parse(item.trackingCaseData).tracks,
              "list"
            );
          });
        this.setActiveCaseTabSub(4);
      }
      // Validate If "Si" Modal Button Clicked And Delete Current LocalStorage Case
      else {
        this.resetCaseData("edit");
        this.updateCurrentTracking(currentCaseData, trackingData);
      }
    });
  }

  createTracking(
    idVolume,
    evidenceId?: any,
    evidences?: any,
    noteId?: any,
    notes?: any,
    message?: string
  ) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });

    const data = {
      evidenceId: evidenceId ? JSON.parse(evidenceId) : null,
      evidences: evidences.length > 0 ? JSON.parse(evidences) : [],
      noteId: noteId ? JSON.parse(noteId) : null,
      notes: notes.length > 0 ? JSON.parse(notes) : [],
      message: message,
    };

    const url = `${environment.URI}/api/trackings/${idVolume}`;

    return this.http.post(url, data, { headers }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        this._notificationsS.message(
          "error",
          "Actualización fallida",
          err.message,
          false,
          false,
          "",
          "",
          2000
        );
        return throwError(err);
      })
    );
  }

  deleteTracking(idTracking: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/trackings/${idTracking}`;

    return this.http
      .delete(url, { headers, reportProgress: true, observe: "events" })
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  deleteTrackingDoc(id: string, idDoc: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/trackings/${id}/doc/${idDoc}`;

    return this.http.delete(url, { headers }).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  async getMatchedCase(
    cases: any,
    obteinedCase: any,
    caseAction: string
  ): Promise<any[]> {
    // Get Casedata after tracking matching

    const newCasesArray = cases.map((caseItem) =>
      caseItem._id === obteinedCase._id
        ? {
            ...caseItem,
            tracks: obteinedCase.tracks,
          }
        : caseItem
    );

    return await new Promise((resolve, reject) => resolve(newCasesArray));
  }

  async getMatchedTracking(
    caseData: any,
    tracking: any,
    trackingAction: string,
    trackingIndex?: number
  ): Promise<any> {
    // Get Casedata after tracking matching
    let obtainedCaseTracking;
    if (trackingAction === "get") {
      obtainedCaseTracking = caseData.tracks.filter((track) => {
        return track._id === tracking._id;
      });
    } else if (trackingAction === "new") {
      obtainedCaseTracking = [tracking[0], ...caseData.tracks];
    } else {
      const tempCasesTrackingArray = caseData.tracks.filter((track) => {
        return track._id !== tracking[0]._id;
      });

      // obtainedCaseTracking = [tracking[0], ...tempCasesTrackingArray];

      tempCasesTrackingArray.splice(
        caseData.tracks.length - 1 - (trackingIndex - 1),
        0,
        tracking[0]
      );

      obtainedCaseTracking = tempCasesTrackingArray;
    }

    const obtainedCaseData = {
      actor: caseData.actor,
      affair: caseData.affair,
      assigned_client: caseData.assigned_client,
      defendant: caseData.defendant,
      extKey: caseData.extKey,
      intKey: caseData.intKey,
      observations: caseData.observations,
      start_date: caseData.start_date,
      status: caseData.status,
      third: caseData.third,
      tracks: obtainedCaseTracking,
      user: caseData.user,
      volumes: caseData.volumes,
      _id: caseData._id,
    };

    return await new Promise((resolve, reject) => resolve(obtainedCaseData));
  }

  isCurrentTrackingBeingUpdated(trackingIndex: number): boolean {
    let isTrackingIndexEqual: boolean = false;

    this._localStorageS
      .getLocalStoragePropertyIfExists(["caseTrackingIndex"])
      .map((item) =>
        trackingIndex === Number(item.caseTrackingIndex)
          ? (isTrackingIndexEqual = true)
          : (isTrackingIndexEqual = false)
      );

    return isTrackingIndexEqual;
  }

  getTrackings(
    idFile: string,
    page: number = 0,
    perPage: number = 10,
    orderField: string = "",
    orderType: string = "",
    filter: string = "",
    filterOpt: string = "",
    status: string = "SENT"
  ): Observable<TrackingsPagination> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    let url = `${
      environment.URI
    }/api/trackings/${idFile}?status=${status}&page=${
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
      .get<TrackingsPagination>(url, { headers })
      .pipe(map((resp: any) => resp.trackings));
  }

  getTracking(id: string): Observable<Tracking> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/trackings/${id}`;

    return this.http
      .get<Tracking>(url, { headers })
      .pipe(
        map((resp: any) => {
          // if (resp) {
          //   this._updateDataS.setItemTrack(
          //     "trackingData",
          //     JSON.stringify(resp.tracking)
          //   );
          //   this._updateDataS.setItemTracking("updating", true);
          // }
          return resp.tracking;
        })
      );
  }

  reset(currentCaseData: any, trackingAction: string, trackingIndex?: number) {
    let currentAction: string;
    let currentIndex: Number;

    if (trackingAction === "new") {
      currentAction = "Creado";
      currentIndex = currentCaseData.tracks.length + 1;
    } else {
      currentAction = "Actualizado";
      currentIndex = trackingIndex;
    }

    this._notificationsS.message(
      "success",
      `Evento #${currentIndex} ${currentAction}`,
      `Cliente: ${currentCaseData.assigned_client[0].firstName} 
      ${currentCaseData.assigned_client[0].lastName}           
      Expediente: ${currentCaseData.affair}`,
      false,
      true,
      "Aceptar",
      ""
    );

    this.resetCaseData(trackingAction);
    this.setActiveCaseTabSub(3);
  }

  resetCaseData(trackingAction?: string) {
    const deleteStorageProperties =
      trackingAction === "new"
        ? ["noteId", "notes", "evidenceId", "evidences", "message"]
        : [
            "caseTrackingId",
            "caseTrackingIndex",
            "isTrackingUpdating",
            "noteId",
            "notes",
            "evidenceId",
            "evidences",
            "message",
          ];

    this._localStorageS.deleteLocalStorageProperty(deleteStorageProperties);
    this.setTrackingMessageValueSub("");
    this._evidencesS.clearCheckEvidences();
    this._notesS.clearCheckNotes();
  }

  trackingPropertiesValidation(
    trackingAction: string,
    currentCaseDataId: number
  ): any[] {
    let isCurrentTrackingCaseInStorage,
      isTrackingBeingCreated: boolean = false;
    const storagePropertiesArray =
      trackingAction === "create"
        ? ["notes", "evidences", "message"]
        : ["trackingCaseData"];

    const isCurrentTrackingUpdating = this._localStorageS.isPropertyInLocalStorage(
      ["isTrackingUpdating"]
    );

    // Validate If Tracking Properties Exists In LocalStorage & Then Compare If Current Tracking Creation ID Is Equal To LocalStorage One
    if (this._localStorageS.isPropertyInLocalStorage(storagePropertiesArray)) {
      isTrackingBeingCreated = true;
      isCurrentTrackingCaseInStorage = this._localStorageS.isPropertyIdInLocalStorageMatched(
        "trackingCaseData",
        currentCaseDataId,
        "different"
      );
    } else {
      isCurrentTrackingCaseInStorage = null;
    }

    return [
      isCurrentTrackingCaseInStorage,
      isTrackingBeingCreated,
      isCurrentTrackingUpdating,
    ];
  }

  setCaseTrackingsData(
    resp: any,
    trackingAction: string,
    cases: any,
    currentCaseData: any,
    trackingIndex?: number
  ) {
    // this._trackingS.notifica.emit({ newTrack: true });
    this.getMatchedTracking(
      currentCaseData,
      resp.tracking,
      trackingAction,
      trackingIndex
    ).then((newTrackingCaseData) => {
      this.getMatchedCase(cases, newTrackingCaseData, trackingAction).then(
        (newCasesArray) => {
          this.setCasesDataSub(newCasesArray);
          if (trackingAction === "new") {
            this.setTrackIdSub(newTrackingCaseData.tracks, trackingAction);
          } else {
            this.setTrackIdSub(newTrackingCaseData.tracks, trackingAction);
          }

          this._localStorageS.addLocalStorageItem(
            "trackingCaseData",
            newTrackingCaseData
          );

          this.setCurrentCaseDataSub(newTrackingCaseData);

          this.reset(currentCaseData, trackingAction, trackingIndex);
        }
      );
    });
  }

  updateTracking(
    idTracking,
    evidenceId?: any,
    evidences?: any,
    noteId?: any,
    notes?: any,
    message?: string
  ) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });

    const data = {
      evidenceId: evidenceId ? JSON.parse(evidenceId) : null,
      evidences: evidences.length > 0 ? JSON.parse(evidences) : [],
      noteId: noteId ? JSON.parse(noteId) : null,
      notes: notes.length > 0 ? JSON.parse(notes) : [],
      message: message,
    };

    const url = `${environment.URI}/api/trackings/${idTracking}`;

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        this._notificationsS.message(
          "error",
          "Actualización fallida",
          err.message,
          false,
          false,
          "",
          "",
          2000
        );
        return throwError(err);
      })
    );
  }

  updateCurrentTracking(currentCaseData: any, trackingData: any) {
    this.getMatchedTracking(currentCaseData, trackingData, "get").then(
      (resp) => {
        const newTrackingCaseData = resp.tracks[0];
        const localStorageArray = [
          { key: "trackingCaseData", value: currentCaseData },
          { key: "caseTrackingIndex", value: trackingData.index },
          { key: "isTrackingUpdating", value: "true" },
          { key: "caseTrackingId", value: trackingData._id },
          { key: "noteId", value: trackingData.noteId },
          { key: "evidenceId", value: trackingData.evidenceId },
        ];

        // Set Storage And Message Form With Message Data
        if (newTrackingCaseData.message) {
          this._localStorageS.addLocalStorageItem(
            "message",
            newTrackingCaseData.message
          );

          this.setTrackingMessageValueSub(newTrackingCaseData.message);
        }

        // Set Storage And Selected Evidences Array With Evidences Data
        if (newTrackingCaseData.trackingEvidences) {
          newTrackingCaseData.trackingEvidences.map((trackingEvidence) => {
            this._evidencesS.setCheckEvidences(trackingEvidence, "check");
            this._evidencesS.setShowingListedEvidences();
          });
        }

        // Set Storage And Selected Notes Array With Notes Data
        if (newTrackingCaseData.trackingNotes) {
          newTrackingCaseData.trackingNotes.map((trackingNote) => {
            this._notesS.setCheckNotes(trackingNote, "check");
            this._notesS.setShowingListedNotes();
          });
        }

        localStorageArray.map((item) => {
          this._localStorageS.addLocalStorageItem(item.key, item.value);
        });

        this.setCurrentTrackIndexSub(trackingData.index);

        this.setActiveCaseTabSub(4);
      }
    );
  }
}
