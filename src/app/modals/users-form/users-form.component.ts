import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ImgService } from '../../services/img.service';
import { User } from '../../models/User';
import { UsersService } from '../../services/users.service';
import { UpdateDataService } from '../../services/updateData.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

declare var $: any;

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.css']
})
export class UsersFormComponent implements OnInit, AfterViewChecked {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UsersFormComponent>,
    private ref: ChangeDetectorRef,
    public _imgS: ImgService,
    public _updateDS: UpdateDataService,
    private _usersS: UsersService
  ) {
    this.check();
  }

  addressLabel: any;
  emailLabel: any;
  errorEmail: boolean = false;
  form: FormGroup;
  imgData: any = null;
  lastnameLabel: any;
  nameLabel: any;
  passwordLabel: any;
  passwordLabel2: any;
  telephoneLabel: any;
  userEmail = new Subject<string>();
  userModalTitle: string;
  public config: PerfectScrollbarConfigInterface = {};

  ngAfterViewChecked() {
    this.ref.detectChanges();
  }

  ngOnInit() {
    this.initRegisterForm();
    this._imgS.uploaderSend("user");

    // Create / Update
    if (this.data) {

      this.userModalTitle = this.data.action;
      if (this.data.idUser && this.data.idUser !== "") {

        this._usersS.getUser(this.data.idUser).subscribe(user => {
          this.requiredPass(this.data.idUser);

          this._imgS.image = user.img;
          this.form.patchValue({
            address: user.address,
            cellPhone: user.cellPhone,
            emailAdmin: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password1: user.password,
            _id: user._id
          });
        })
        this.form.get('password1').clearValidators();
        this.form.get('password1').updateValueAndValidity();
        this.form.get('password2').clearValidators();
        this.form.get('password2').updateValueAndValidity();

      } else {
        this._imgS.image = 'no_image';
        this.form.controls['password1'].setValidators([
          Validators.required, Validators.minLength(9)
        ]);
        this.form.controls['password2'].setValidators([
          Validators.required,
          this.notEqual.bind(this.form)
        ]);
        this.form.reset();
      }
    }
  }

  check() {
    this.userEmail.pipe(
      debounceTime(800),
      distinctUntilChanged())
      .subscribe(value => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          this._usersS.checkEmail(value)
            .subscribe((resp) => {
              if (resp.exist) {
                this.errorEmail = true;
              } else {
                this.errorEmail = false;
              }
              if (this.form.value._id !== '') {
                this.errorEmail = false;
              }

            })
        }
      });
  }

  clearImg() {
    this._imgS.image = null;
  }

  closeModal() {
    this.dialogRef.close()
  }

  create() {
    let addressS = (this.form.value.address === undefined || this.form.value.address === null || this.form.value.address === '') ? '' : this.form.value.address;
    let cellPhoneS = (this.form.value.cellPhone === undefined || this.form.value.cellPhone === null || this.form.value.cellPhone === '') ? '' : this.form.value.cellPhone;
    const user = new User(
      this.form.value.emailAdmin,
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.password1,
      this.form.value.password2,
      addressS,
      cellPhoneS
    );

    if (this.form.value._id !== null) {
      if (this.imgData === null) {
        // Update User
        this._usersS.updateUser(this.form.value._id, user, "").subscribe(() => {
          this._usersS.notifica.emit({ render: true });
          this.closeModal();
        });
      } else {
        this._imgS.uploader.uploadAll();

        this._updateDS
          .getImg()
          .subscribe((data: { url: string; public_id: string }) => {
            this._usersS
              .updateUser(this.form.value._id, user, data)
              .subscribe((resp) => {
                if (resp) {
                  this.imgData = null;
                  this._usersS.notifica.emit({ render: true });
                  this.closeModal();
                }
              });
          });
      }
    } else {
      if (this.imgData === null) {
        // Create User
        this._usersS.createUser(user, '', localStorage.getItem('id')).subscribe(() => {
          this.form.reset();
          this._usersS.notifica.emit({ render: true });
          this.closeModal();
        });
      } else {
        this._imgS.uploader.uploadAll();

        this._updateDS
          .getImg()
          .subscribe((data: { url: string; public_id: string }) => {
            this._usersS.createUser(user, data, localStorage.getItem('id')).subscribe((resp) => {
              console.log(resp);
              if (resp && resp.ok) {
                this.form.reset();
                this.imgData = null;
                this._usersS.notifica.emit({ render: true });
                this.closeModal();
              }
            });
          });
      }
    }
  }

  private initRegisterForm() {
    this.form = new FormGroup({
      address: new FormControl(null),
      cellPhone: new FormControl(null),
      emailAdmin: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      password1: new FormControl(),
      password2: new FormControl(),
      img: new FormControl(null),
      _id: new FormControl(null)
    });
  }

  notEqual(control: FormControl): { [s: string]: boolean } {
    let form: any = this;
    if (control.value !== form.controls['password1'].value) {
      return {
        notEqual: true
      }
    }
    return null;
  }

  requiredPass(id: string) {
    return (id !== '') ? false : true;
  }

  selectImg($event) {
    this.imgData = $event.target.files[0];
    this._imgS.onFileSelected($event);
  }
}