import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Files } from '../../models/Files';
import { User } from '../../models/User';
import { FilesService } from '../../services/files.service';
import { UpdateDataService } from '../../services/updateData.service';
import { UsersService } from '../../services/users.service';

declare var $: any;

@Component({
  selector: 'app-files-form',
  templateUrl: './files-form.component.html',
  styleUrls: ['./files-form.component.css']
})
export class FilesFormComponent implements OnInit {

  constructor(
    public _filesS: FilesService,
    public _usersS: UsersService,
    public _updateData: UpdateDataService
  ) { }

  actor: any;
  affair: any;
  client: any;
  defendant: any;
  observations: any;
  extKey: any;
  fileModalTitle: string;
  form: FormGroup;
  name: any = '';
  subscription: Subscription;
  third: any;
  userData: any = '';
  users: User[];

  ngOnInit() {

    // Get UserData Subscription
    this._updateData.getUserData('expediente').subscribe((data: any) => {
      this.userData = data;
      this.name = (data !== '') ? data.firstName + ' ' + data.lastName : '';
    });

    // Get User List Subscription
    this._usersS.getUsers()
      .subscribe(resp => {
        this.users = resp.docs;
      })

    this.initPostsForm();

    // Create / Update Subscription
    this.subscription = this._updateData.getFileId().subscribe((data: { id: string, action: string }) => {
      this._filesS.getFile(data.id).subscribe(file => {
        this.fileModalTitle = data.action;
        if (data.id !== '') {
          let nameClient = `${file.assigned_client.firstName} ${file.assigned_client.lastName}`;
          this.form.patchValue({
            actor: file.actor,
            affair: file.affair,
            assigned_client: nameClient,
            defendant: file.defendant,
            extKey: file.extKey,
            observations: file.observations,
            third: file.third,
            _id: file._id
          })
        } else {
          this.form.reset();
        }
      })
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  create() {
    let extK = (this.form.value.extKey === '') ? 'N/E' : this.form.value.extKey;
    let intKey = 'ryghery8her89yr8';
    const file = new Files(
      this.form.value.actor,
      this.form.value.affair,
      this.userData._id,
      this.form.value.defendant,
      intKey,
      null,
      this.form.value.observations,
      null,
      this.form.value.third,
      extK
    );

    if (this.form.value._id !== null) {
      // Update File
      this._filesS.updateFile(this.form.value._id, file).subscribe(() => {
        this._filesS.notifica.emit({ render: true })
      });
    } else {
      // Create File
      this._filesS.createFile(file).subscribe(() => {
        this.form.reset();
        this._filesS.notifica.emit({ render: true })
      })
    }
  }

  private initPostsForm() {
    this.form = new FormGroup({
      actor: new FormControl(null, Validators.required),
      affair: new FormControl(null, Validators.required),
      assigned_client: new FormControl(null, Validators.required),
      defendant: new FormControl(null, Validators.required),
      extKey: new FormControl(null),
      observations: new FormControl(null),
      third: new FormControl(null),
      _id: new FormControl(null)
    });
  }

  // Send Action to Update Data Service
  updateDataServiceAction() {
    this._updateData.dataServiceAction("expediente");
  }
}