import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Files } from '../../models/Files';
import { User } from '../../models/User';
import { FilesService } from '../../services/files.service';
import { UpdateDataService } from '../../services/updateData.service';
import { UsersService } from '../../services/users.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MatDialogRef } from '@angular/material';

declare var $: any;

@Component({
  selector: 'app-files-form',
  templateUrl: './files-form.component.html',
  styleUrls: ['./files-form.component.css']
})
export class FilesFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FilesFormComponent>,
    public _filesS: FilesService,
    public _usersS: UsersService,
    public _updateData: UpdateDataService
  ) { }

  actor: any;
  affair: any;
  fileCreation: boolean = true;
  client: any;
  defendant: any;
  extKey: any;
  fileModalTitle: string;
  form: FormGroup;
  isChecked: boolean = false;
  name: any = '';
  observations: any;
  selectedRowData: any;
  subscription: Subscription;
  third: any;
  userData: any = '';
  users: User[];
  selectedTab = new FormControl(0);
  selectedClientIndex: any;
  activeClientIndex: any;
  public config: PerfectScrollbarConfigInterface = {};

  ngOnInit() {

    // Get UserData Subscription
    this._updateData.getUserData('expediente').subscribe((data: any) => {
      if (data !== '' && data !== null) {
        this.userData = data;
        if (localStorage.getItem('userData')) {
          this.name =
            JSON.parse(localStorage.getItem("userData")).firstName +
            " " +
            JSON.parse(localStorage.getItem("userData")).lastName;
        } else {
          this.name = data.firstName + ' ' + data.lastName;
        }
      }
    });

    // Get User List Subscription
    this._usersS.getUsers()
      .subscribe(resp => {
        this.users = resp.docs;
      })

    this.initFilesForm();

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
    let extKey = this.form.value.extKey === '' ? null : this.form.value.extKey;
    let observations = this.form.value.observations === '' ? null : this.form.value.observations;
    let third = this.form.value.third === '' ? null : this.form.value.third;
    let intKey = 'ryghery8her89yr8';

    const file = new Files(
      this.form.value.actor,
      this.form.value.affair,
      this.userData._id,
      this.form.value.defendant,
      intKey,
      null,
      null,
      extKey,
      observations,
      "",
      "",
      third
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

  private initFilesForm() {
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

  isCheckedFunction(data: any, index: any) {
    if ((this.selectedClientIndex !== undefined && this.activeClientIndex !== undefined)
      && this.activeClientIndex === index) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }

    this.selectedRowData = data;
  }

  // Send Action to Update Data Service
  updateDataServiceAction() {
    this._updateData.dataServiceAction("expediente");
  }

  setData() {
    if (this.selectedRowData !== '' && this.selectedRowData !== null) {
      this._updateData.setItemUser(
        "userData",
        JSON.stringify(this.selectedRowData)
      );
      this._updateData.setUserData(this.selectedRowData);
      this.activeClientIndex = this.selectedClientIndex;
      this.changeButtons(true);
    }
  }

  // Select file user buttons
  changeButtons(isCreating) {
    this.fileCreation = isCreating;
    if (isCreating) {
      this.selectedClientIndex = this.activeClientIndex;
    } else {
      if (this.selectedClientIndex === this.activeClientIndex) {
        this.isChecked = false;
      }
    }
  }
}