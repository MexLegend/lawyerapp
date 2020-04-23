import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { Post } from '../../models/Post';
import { PostsService } from '../../services/posts.service';
import { UpdateDataService } from '../../services/updateData.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  constructor(
    private _postsS: PostsService,
    public _updateDS: UpdateDataService
  ) { }

  posts: Post[] = [];

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  ngOnInit() {
    this._postsS.getPosts().subscribe(resp => {
      this.posts = resp.docs;
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar articulos"
      },
      scrollY: "calc(100vh - 431px)",
      scrollCollapse: true

    }

    this._postsS.notifica
      .subscribe(() => {
        this.load();
        this.rerender()
      }
      )
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  delete(post: Post) {
    Swal.fire({
      icon: 'warning',
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar el artículo ' + post.title,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
      .then((result) => {
        if (result.value) {
          this._postsS.deletePost(post._id).subscribe(() => {
            this.load();
            this.rerender();
          })
        }
      })
  }

  load() {
    this._postsS.getPosts().subscribe(resp => {
      this.posts = resp.docs;
    })
  }

  // Update Datatable data after content changes
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

    });
  }

  sendId(id: string, action: string) {
    this._updateDS.sendArticleId(id, action)
  }
}