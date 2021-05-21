import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs/internal/Subject";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { UsersService } from "../../../services/users.service";
import { Subscription } from "rxjs";
import { ContactService } from "../../../services/contact.service";
import { Contact } from "../../../models/Contact";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-register-form",
  templateUrl: "./register-form.component.html",
  styleUrls: ["./register-form.component.css"],
})
export class RegisterFormComponent implements OnInit {
  constructor(
    private _contactS: ContactService,
    public dialogRef: MatDialogRef<RegisterFormComponent>,
    private _usersS: UsersService
  ) {
    this.check();
  }

  subscriptionsArray: Subscription[] = [];

  errorEmail: boolean = false;
  form: FormGroup;
  userEmail = new Subject<string>();

  ngOnInit() {
    this.initRegisterForm();
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  check() {
    this.subscriptionsArray.push(
      this.userEmail
        .pipe(debounceTime(800), distinctUntilChanged())
        .subscribe((value) => {
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            this.subscriptionsArray.push(
              this._usersS.checkEmail(value).subscribe((resp) => {
                if (resp.exist) {
                  this.errorEmail = true;
                } else {
                  this.errorEmail = false;
                }
              })
            );
          } else {
            console.log(false);
          }
        })
    );
  }

  create() {
    const { _id: _id, ...userData } = this.form.value;

    const email = new Contact(
      null,
      this.form.value.email,
      null,
      null,
      "Verificar cuenta de Haizen",
      "Fernando Romo Rodríguez",
      null
    );

    this.subscriptionsArray.push(
      this._usersS.createUser(userData).subscribe((resp: any) => {
        if (resp.ok) {
          this.subscriptionsArray.push(
            this._contactS
              .enviarEmail(
                { ...email, id: resp.user._id },
                "confirmAccount",
                this.dialogRef
              )
              .subscribe()
          );
        }
        this.form.reset();
      })
    );
  }

  private initRegisterForm() {
    this.form = new FormGroup({
      address: new FormControl(null),
      cellPhone: new FormControl(null),
      email: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      img: new FormControl(null),
      lastName: new FormControl(null, Validators.required),
      password1: new FormControl(null, [
        Validators.required,
        Validators.minLength(9),
      ]),
      password2: new FormControl(),
    });

    this.form.controls["password2"].setValidators([
      Validators.required,
      this.notEqual.bind(this.form),
    ]);
  }

  notEqual(control: FormControl): { [s: string]: boolean } {
    let form: any = this;
    if (control.value !== form.controls["password1"].value) {
      return {
        notEqual: true,
      };
    }
    return null;
  }
}
