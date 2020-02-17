import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UpdateDataService {

    private userData = new BehaviorSubject('');
    private fileData = new BehaviorSubject('');

    constructor() { }

    public getUserData() {
        return this.userData.asObservable();
    }

    public setUserData(receivedUserData: any) {
        this.userData.next(receivedUserData);
    }

    public getFileData() {
        return this.fileData.asObservable();
    }

    public setFileData(receivedFileData: any) {
        this.fileData.next(receivedFileData);
    }
}