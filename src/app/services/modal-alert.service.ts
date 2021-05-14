import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ModalAlertService {
  private modalAlertRef = new Subject<any>();
  private toogleServerAlerts = new Subject<[boolean, string, string]>();

  public getModalAlertRef(): Observable<any> {
    return this.modalAlertRef.asObservable();
  }

  public setModalAlertRef(modalRef: any) {
    this.modalAlertRef.next(modalRef);
  }

  // Server Alert Functions
  getServerAlerts(): Observable<any> {
    return this.toogleServerAlerts.asObservable();
  }

  setServerAlerts(show: boolean, type: string, message: string) {
    this.toogleServerAlerts.next([show, type, message]);
  }
}
