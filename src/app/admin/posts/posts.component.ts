import { Component, OnInit, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

import { Post } from '../../models/Post';
import { PostsService } from '../../services/posts.service';
import { UpdateDataService } from '../../services/updateData.service';
import { PostsFormComponent } from '../../modals/posts-form/posts-form.component';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  constructor(
    private _postsS: PostsService,
    public _updateDS: UpdateDataService,
    public dialog: MatDialog
  ) { }
  currentPage: number = 1;
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  filterValue: string;
  posts: Post[] = [];
  selectedEntry: number = 5;

  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};

  // Detect Real Screen Size
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerScreenWidth = window.innerWidth;
    if (this.innerScreenWidth > 520) {
      this.mobileFilterActivated = false;
    }
  }

  ngOnInit() {
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

    this._postsS.getPosts().subscribe(resp => {
      console.log(resp.docs)
      this.posts = resp.docs;
    });

    this._postsS.notifica
      .subscribe(() => {
        this.load();
      }
      )
  }

  // Change Current Pagination Page
  changeEntry($event) {
    this.selectedEntry = $event;
    this.currentPage = 1;
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
          })
        }
      })
  }

  filter(value: string) {
    if (value.length >= 1 && value !== '')
      this.filterValue = value;
    else
      this.filterValue = '';
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  load() {
    this._postsS.getPosts().subscribe(resp => {
      this.posts = resp.docs;
    })
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  // Open Posts Modal
  openPostsModal(idPost?: any) {
    let dialogRef = idPost && idPost !== '' ? this.dialog.open(PostsFormComponent, { data: { idPost, action: 'Editar' }, autoFocus: false }) : this.dialog.open(PostsFormComponent, { data: { action: 'Escribir' }, autoFocus: false });

    // dialogRef.afterClosed().subscribe(result => {
    //   localStorage.removeItem('userData');
    //   localStorage.removeItem('fileData');
    //   this._updateDS.setUserData(null);
    // });
  }

  sendId(id: string, action: string) {
    this._updateDS.sendArticleId(id, action)
  }
}