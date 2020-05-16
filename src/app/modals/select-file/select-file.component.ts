import { Component, OnInit } from '@angular/core';

import { Files } from '../../models/Files';
import { FilesService } from '../../services/files.service';
import { UpdateDataService } from '../../services/updateData.service';
import { DataTableDirective } from 'angular-datatables';
import { UsersService } from '../../services/users.service';

declare var $: any;

@Component({
  selector: "app-select-file",
  templateUrl: "./select-file.component.html",
  styleUrls: ["./select-file.component.css"],
})
export class SelectFileComponent implements OnInit {
  constructor(
    private _filesS: FilesService,
    private _updateData: UpdateDataService,
    public _usersS: UsersService
  ) {}

  fileData: any;
  files: Files[] = [];
  isChecked: boolean = false;
  selectedRowData: any;

  ngOnInit() {
    // Get UserData Subscription
    this._updateData.getUserData("seguimiento").subscribe((data: any) => {
      // Get Files Subscription
      if (data !== "" && data !== null || localStorage.getItem('userData')) {

        let idFile = localStorage.getItem("userData")
          ? JSON.parse(localStorage.getItem("userData"))._id
          : data._id;

        this._filesS.getAll(idFile).subscribe((resp) => {
          this.files = resp;
        });
      }
    });

    // Set UserData Subscription
    this._updateData.getFileData().subscribe((data: any) => {
      this.fileData = data;
    });

    $(document).ready(function () {
      // Show/Hide Close Serach Box Button
      $(document).on("keyup", ".buscadorAdminFiles input", function () {
        if ($(this).val() !== "") {
          $(this)
            .closest($(".buscadorAdminFiles"))
            .find($(".filter-close"))
            .css("display", "flex");
        } else {
          $(this)
            .closest($(".buscadorAdminFiles"))
            .find($(".filter-close"))
            .css("display", "none");
        }
      });
      // Clear Serach Box On Close Button Click
      $(document).on("click", ".filter-close", function () {
        $(this).css("display", "none");
        $(this)
          .closest($(".buscadorAdminFiles"))
          .find($(".buscadorAdminFiles input"))
          .val("");
        $("#select-files-tbl").DataTable().search("").draw();
      });
    });
  }

  // Enable Select Button On Checkbox Click And Get Data
  isCheckedFunction(data: any) {
    if (this.isChecked === false) {
      this.isChecked = true;
    }

    this.selectedRowData = data;
  }

  printData() {
    if(this.selectedRowData !== '' && this.selectedRowData !== null) {

      this._updateData.setItemFile(
        "fileData",
        JSON.stringify(this.selectedRowData)
      );
    }
    
    this._updateData.setFileData(this.selectedRowData);
  }
}