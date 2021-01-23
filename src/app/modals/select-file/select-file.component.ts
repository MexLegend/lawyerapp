import { Component, OnInit } from "@angular/core";

import { Cases } from "../../models/Cases";
import { CasesService } from "../../services/cases.service";
import { UpdateDataService } from "../../services/updateData.service";
import { DataTableDirective } from "angular-datatables";
import { UsersService } from "../../services/users.service";
import { Subscription } from "rxjs";

declare var $: any;

@Component({
  selector: "app-select-file",
  templateUrl: "./select-file.component.html",
  styleUrls: ["./select-file.component.css"],
})
export class SelectFileComponent implements OnInit {
  constructor(
    private _casesS: CasesService,
    private _updateData: UpdateDataService,
    public _usersS: UsersService
  ) {}

  subscriptionsArray: Subscription[] = [];

  fileData: any;
  files: Cases[] = [];
  isChecked: boolean = false;
  selectedRowData: any;

  ngOnInit() {
    // Get UserData Subscription
    this.subscriptionsArray.push(
      this._updateData.getUserData("seguimiento").subscribe((data: any) => {
        // Get Files Subscription
        if (
          (data !== "" && data !== null) ||
          localStorage.getItem("userData")
        ) {
          let idFile = localStorage.getItem("userData")
            ? JSON.parse(localStorage.getItem("userData"))._id
            : data._id;

          this.subscriptionsArray.push(
            this._casesS.getAll(idFile).subscribe((resp) => (this.files = resp))
          );
        }
      })
    );

    // Set UserData Subscription
    this.subscriptionsArray.push(
      this._updateData
        .getFileData()
        .subscribe((data: any) => (this.fileData = data))
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

  printData() {
    if (this.selectedRowData !== "" && this.selectedRowData !== null) {
    }

    this._updateData.setFileData(this.selectedRowData);
  }
}
