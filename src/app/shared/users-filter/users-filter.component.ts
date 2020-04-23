import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-users-filter',
  templateUrl: './Users-filter.component.html',
  styleUrls: ['./Users-filter.component.css']
})
export class UsersFilterComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    $(document).ready(function () {
      // Filter User Table By All - Users
      $(document).on("click", "#all-users", function () {
        $("#users-tbl").DataTable().column(1).search("").draw();
      });
      // Filter User Table By Frequent - Users
      $(document).on("click", "#frequent-users", function () {
        $("#users-tbl").DataTable().column(1).search("Alex").draw();
      });
      // Filter User Table By Featured - Users
      $(document).on("click", "#featured-users", function () {
        $("#users-tbl").DataTable().column(1).search("grgf").draw();
      });
      // Filter User Table By Admin - Users
      $(document).on("click", "#admin-users", function () {
        $("#users-tbl").DataTable().column(1).search("Luis").draw();
      });
      // Filter User Table By Client - Users
      $(document).on("click", "#client-users", function () {
        $("#users-tbl").DataTable().column(1).search("Armando").draw();
      });
      // Filter User Table By Normal - Users
      $(document).on("click", "#normal-users", function () {
        $("#users-tbl").DataTable().column(1).search("Ejemplo").draw();
      });
    });
  }
}