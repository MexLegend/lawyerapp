import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";

import { User } from "../../models/User";
import { UpdateDataService } from "../../services/updateData.service";
import { UsersService } from "../../services/users.service";
import { Subscription } from "rxjs";

declare var $: any;

@Component({
  selector: "app-select-user",
  templateUrl: "./select-user.component.html",
  styleUrls: ["./select-user.component.css"],
})
export class SelectUserComponent implements OnInit {
  constructor(
    private _updateData: UpdateDataService,
    private _usersS: UsersService
  ) {}

  subscriptionsArray: Subscription[] = [];

  isChecked: boolean = false;
  selectedRowData: any;
  userData: any;
  users: User[] = [];

  ngOnInit() {
    // List Users Subscription
    this.subscriptionsArray.push(
      this._usersS.getUsersList().subscribe((usersList) => {
        this.users = usersList;
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Enable Select Button On Checkbox Click And Get Data
  isCheckedFunction(data: any) {
    if (this.isChecked === false) {
      this.isChecked = true;
    }

    this.selectedRowData = data;
  }

  setData() {
    if (this.selectedRowData !== "" && this.selectedRowData !== null) {
      this._updateData.setItemUser(
        "userData",
        JSON.stringify(this.selectedRowData)
      );
    }

    this._updateData.setUserData(this.selectedRowData);
  }
}
