import { Injectable, Component } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UpdateDataService {

    private expedienteSeguimientoAction = String('');
    private expedienteData = new BehaviorSubject('');
    private seguimientoData = new BehaviorSubject('');
    private fileData = new BehaviorSubject('');
    private articleSubject = new Subject<any>();
    private userSubject = new Subject<any>();
    private fileSubject = new Subject<any>();

    constructor() { }

    sendArticleId(id: string) {
        this.articleSubject.next(id);
    }

    getArticleId(): Observable<any> {
        return this.articleSubject.asObservable();
    }

    sendUserId(id: string) {
        this.userSubject.next(id);
    }

    getUserId(): Observable<any> {
        return this.userSubject.asObservable();
    }

    sendFileId(id: string) {
        this.fileSubject.next(id);
    }

    getFileId(): Observable<any> {
        return this.fileSubject.asObservable();
    }

    public dataServiceAction(action: any) {
        this.expedienteSeguimientoAction = action;
    }

    public getUserData(component: any) {
        if (component === 'seguimiento') {
            return this.seguimientoData.asObservable();
        } else {
            return this.expedienteData.asObservable();
        }
    }

    public setUserData(receivedUserData: any) {
        if (String(this.expedienteSeguimientoAction) === 'seguimiento') {
            this.seguimientoData.next(receivedUserData);
        } else {
            this.expedienteData.next(receivedUserData);
        }
    }

    public getFileData() {
        return this.fileData.asObservable();
    }

    public setFileData(receivedFileData: any) {
        this.fileData.next(receivedFileData);
    }
}