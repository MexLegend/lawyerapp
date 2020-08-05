import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Files } from '../../models/Files';
import { User } from '../../models/User';
import { FilesService } from '../../services/files.service';
import { UpdateDataService } from '../../services/updateData.service';
import { UsersService } from '../../services/users.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotificationsService } from '../../services/notifications.service';

declare var $: any;

@Component({
  selector: 'app-files-form',
  templateUrl: './files-form.component.html',
  styleUrls: ['./files-form.component.css']
})
export class FilesFormComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FilesFormComponent>,
    public _filesS: FilesService,
    public _notificationsS: NotificationsService,
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

    if (this.data) {
      this.fileModalTitle = this.data.action;
      if(this.data.idFile && this.data.idFile !== "") {

        this._filesS.getFile(this.data.idFile).subscribe((file) => {
  
            let nameClient = `${file.assigned_client.firstName} ${file.assigned_client.lastName}`;
            this.form.patchValue({
              actor: file.actor,
              affair: file.affair,
              assigned_client: nameClient,
              defendant: file.defendant,
              extKey: file.extKey,
              observations: file.observations,
              third: file.third,
              _id: file._id,
            });
          
        });
      } else {
        this.form.reset();
      }
    }

  }

  closeModal() {
    this.dialogRef.close()
  }

  create() {
    let extKey = this.form.value.extKey === "" || this.form.value.extKey === null ? "" : this.form.value.extKey;
    let observations =
      this.form.value.observations === "" || this.form.value.observations === null ? "" : this.form.value.observations;
    let third = this.form.value.third === "" || this.form.value.third === null ? "" : this.form.value.third;
    let intKey = "ryghery8her89yr8";

    const file = new Files(
      this.form.value.actor,
      this.form.value.affair,
      this.userData._id,
      this.form.value.defendant,
      intKey,
      extKey,
      observations,
      third
    );

    if (this.form.value._id !== null) {
      // Update File
      this._filesS.updateFile(this.form.value._id, file).subscribe((resp) => {
        this._notificationsS.message(
          "success",
          "Actualización correcta",
          resp.message,
          false,
          false,
          "",
          "",
          2000
        );
        this._filesS.notifica.emit({ render: true });
        this.closeModal();
      });
    } else {
      // Create File
      this._filesS.createFile(file).subscribe(() => {
        this.form.reset();
        this._filesS.notifica.emit({ render: true });
        this.closeModal();
      });
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