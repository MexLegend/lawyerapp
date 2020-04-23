import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UpdateDataService {

    private articleSubject = new Subject<any>();
    private expedienteData = new BehaviorSubject('');
    private expedienteSeguimientoAction = String('');
    private fileData = new BehaviorSubject('');
    private fileSubject = new Subject<any>();
    private imgSubject = new Subject<any>();
    private seguimientoData = new BehaviorSubject('');
    private userSubject = new Subject<any>();

    constructor() { }

    getArticleId(): Observable<any> {
        return this.articleSubject.asObservable();
    }
    
    sendArticleId(id: string, action: string) {
        this.articleSubject.next({ id, action });
    }

    getValidateUserPass(): Observable<any> {
        return this.userSubject.asObservable();
    }

    validateUserPass(id: string) {
        this.userSubject.next(id);
    }

    getImg(): Observable<any> {
        return this.imgSubject.asObservable();
    }
    
    sendImg(url: string, public_id: string) {
        this.imgSubject.next({ url, public_id });
    }

    getUserId(): Observable<any> {
        return this.userSubject.asObservable();
    }

    sendUserId(id: string, view: boolean) {
        this.userSubject.next({ id, view });
    }

    getFileId(): Observable<any> {
        return this.fileSubject.asObservable();
    }

    sendFileId(id: string, action: string) {
        this.fileSubject.next({ id, action });
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