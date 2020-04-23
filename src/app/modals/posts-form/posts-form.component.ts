import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from 'rxjs';

import { ImgService } from '../../services/img.service';
import { Post } from '../../models/Post';
import { PostsService } from '../../services/posts.service';
import { UpdateDataService } from '../../services/updateData.service';

declare var $: any;

@Component({
  selector: 'app-posts-form',
  templateUrl: './posts-form.component.html',
  styleUrls: ['./posts-form.component.css']
})
export class PostsFormComponent implements OnInit {

  constructor(
    public _imgS: ImgService,
    private _postsS: PostsService,
    public _updateDS: UpdateDataService
  ) {}

  external_sourcesLabel: any;
  @Input() editor: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Escribe tu artículo aquí*',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
  };
  form: FormGroup;
  imgData: any = null;
  postModalTitle: string;
  subscription: Subscription;
  titleLabel: any;

  ngOnInit() {
    this.initArticulosForm();
    this._imgS.uploaderSend("post");

    // Create / Update Subscription
    this.subscription = this._updateDS.getArticleId()
      .subscribe((data: { id: string, action: string }) => {
        this.postModalTitle = data.action;
        
        if ( data.action === 'Crear' ) {
          this._imgS.image = 'no_image';
        }
        
        if (data.id && data.id !== '') {
          this._postsS.getPost(data.id).subscribe((post: Post) => {

            this._imgS.image = post.img;
            this.form.patchValue({
              content: post.content,
              title: post.title,
              external_sources: post.external_sources,
              _id: post._id
            })
          })
        } else {
          this.form.reset();
        }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clearImg() {
    this._imgS.image = null;
  }

  create() {
    let externalS =
      this.form.value.external_sources === undefined ||
      this.form.value.external_sources === null ||
      this.form.value.external_sources === ""
        ? ""
        : this.form.value.external_sources;
    
    const post = new Post(
      this.form.value.content,
      this.form.value.title,
      null,
      externalS
    );

    if (this.form.value._id !== null) {
      if (this.imgData === null) {
        console.log("UPDATE ONLY");
        // Update Article
        this._postsS.updatePost(this.form.value._id, post, "").subscribe(() => {
          this._postsS.notifica.emit({ render: true });
        });
      } else {
        this._imgS.uploader.uploadAll();
        console.log("UPDATE IMAGE");

        this.subscription = this._updateDS
          .getImg()
          .subscribe((data: { url: string; public_id: string }) => {
            this._postsS
              .updatePost(this.form.value._id, post, data)
              .subscribe((resp) => {
                if (resp) {
                  this.imgData = null;
                  this._postsS.notifica.emit({ render: true });
                  this.subscription.unsubscribe();
                }
              });
          });
      }
    } else {
      if (this.imgData === null) {
        console.log("CREATE ONLY");
        // Create Article
        this._postsS.createPost(post, '').subscribe(() => {
          this.form.reset();
          this._postsS.notifica.emit({ render: true });
        });
      } else {
        console.log("CRETE");
        // return;
        this._imgS.uploader.uploadAll();

        this.subscription = this._updateDS
          .getImg()
          .subscribe((data: { url: string; public_id: string }) => {
            this._postsS.createPost(post, data).subscribe((resp) => {
              if (resp.ok) {
                this.form.reset();
                this.imgData = null;
                this._postsS.notifica.emit({ render: true });
              }
            });
          });
      }
    }
  }

  imageValidation($event) {
    this._imgS.imageValidation($event);
  }

  private initArticulosForm() {
    this.form = new FormGroup({
      content: new FormControl(null, Validators.compose([
        Validators.required,
        AngularEditorValidator.required()
      ])),
      external_sources: new FormControl(null),
      img: new FormControl(null),
      title: new FormControl(null, Validators.required),
      _id: new FormControl(null)
    });
  }

  selectImg($event) {
    this.imgData = $event.target.files[0];
    this._imgS.onFileSelected($event);
  }
}

class AngularEditorValidator {
  static required(): ValidatorFn {
    return (currentControl: AbstractControl): ValidationErrors | null => {
      if (currentControl.value === '<br>') {
        return { required: true };
      }
      return null;
    };
  }
}
