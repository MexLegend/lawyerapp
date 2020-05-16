import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import { User } from '../../models/User';
import { UpdateDataService } from '../../services/updateData.service';
import { UsersService } from '../../services/users.service';

declare var $: any;

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent implements OnInit {

  constructor(
    private _updateData: UpdateDataService,
    private _usersS: UsersService
  ) {}
  
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();
  isChecked: boolean = false;
  selectedRowData: any;
  userData: any;
  users: User[] = [];

  ngOnInit() {
    // Get Users Subscription
    this._usersS.getUsers().subscribe(resp => {
      this.users = resp.docs;
      this.dtTrigger.next();
    });

    // Set UserData Subscription
    // this._updateData.getUserData().subscribe(data => this.userData = data)

    // Change Datatable Options
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar clientes.."
      },
      "scrollY": "calc(100vh - 542px)",
      "scrollCollapse": true,
      initComplete: function () {
        $("#select-users-tbl_filter").detach().appendTo('.buscadorAdminUsers');
      }
    };

    $(document).ready(function () {
      // Show/Hide Close Serach Box Button
      $(document).on("keyup", ".buscadorAdminUsers input", function () {
        if ($(this).val() !== '') {
          $(this).closest($(".buscadorAdminUsers")).find($('.filter-close')).css('display', "flex");
        } else {
          $(this).closest($(".buscadorAdminUsers")).find($('.filter-close')).css('display', "none");
        }
      })
      // Clear Serach Box On Close Button Click
      $(document).on("click", ".filter-close", function () {
        $(this).css('display', "none");
        $(this).closest($(".buscadorAdminUsers")).find($('.buscadorAdminUsers input')).val("");
        $("#select-users-tbl").DataTable().search("").draw();
      })
    });
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  // Enable Select Button On Checkbox Click And Get Data
  isCheckedFunction(data: any) {
    if ( this.isChecked === false ) {
      this.isChecked = true;
    }
    
    this.selectedRowData = data;
  }

  setData() {
    if(this.selectedRowData !== '' && this.selectedRowData !== null) {

      this._updateData.setItemUser(
        "userData",
        JSON.stringify(this.selectedRowData)
      );
    }
    
    this._updateData.setUserData(this.selectedRowData);
    // this._updateData.setFileData(null);
  }
}