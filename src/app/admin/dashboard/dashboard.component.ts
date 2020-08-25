import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from '../../modals/reply/reply.component';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  public comments = [1, 2, 3, 4, 5, 6, 7, 8];
  public config: PerfectScrollbarConfigInterface = {};
  public type: string = 'component';

  ngOnInit() {
  }

  // Open Users Modal
  openReplyModal(idUser?: any) {
    let dialogRef = this.dialog.open(ReplyComponent, { data: { idUser, action: 'Editar' }, autoFocus: false });
  }
}
