import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ModalAlertService {
  private modalAlertRef = new Subject<any>();

  public getModalAlertRef(): Observable<any> {
    return this.modalAlertRef.asObservable();
  }

  public setModalAlertRef(modalRef: any) {
    this.modalAlertRef.next(modalRef);
  }
}
