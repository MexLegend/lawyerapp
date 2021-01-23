import { Component, Input, OnInit, Inject } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { AngularEditorConfig } from "@kolkov/angular-editor";

import { CloudinaryService } from "../../services/cloudinary.service";
import { Post } from "../../models/Post";
import { PostsService } from "../../services/posts.service";
import { UpdateDataService } from "../../services/updateData.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Subscription } from "rxjs";

@Component({
  selector: "app-posts-form",
  templateUrl: "./posts-form.component.html",
  styleUrls: ["./posts-form.component.css"],
})
export class PostsFormComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PostsFormComponent>,
    public _cloudinaryS: CloudinaryService,
    private _postsS: PostsService,
    public _updateDS: UpdateDataService
  ) {}

  subscriptionsArray: Subscription[] = [];

  @Input() editor: any;

  external_sourcesLabel: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "0",
    maxHeight: "auto",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Escribe tu artículo aquí*",
    defaultParagraphSeparator: "",
    defaultFontName: "",
    defaultFontSize: "",
    fonts: [
      { class: "arial", name: "Arial" },
      { class: "times-new-roman", name: "Times New Roman" },
      { class: "calibri", name: "Calibri" },
      { class: "comic-sans-ms", name: "Comic Sans MS" },
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    uploadUrl: "v1/image",
    sanitize: true,
    toolbarPosition: "top",
  };
  form: FormGroup;
  imgData: any = null;
  isPostUpdating: boolean = false;
  postModalTitle: string;
  titleLabel: any;

  public config: PerfectScrollbarConfigInterface = {};

  ngOnInit() {
    this.initArticulosForm();
    // Init Cloudinary Uploader Options - Img / Evidences
    this._cloudinaryS.uploaderSend("image");

    // Get Cloudinary File Uploaded Response
    this.subscriptionsArray.push(
      this._cloudinaryS.getFile().subscribe(({ url, public_id }) => {
        this.createNewPostAfterResponse({ url, public_id });
      })
    );

    // Validate Invalid Format Files
    this._cloudinaryS.uploader.onWhenAddingFileFailed = (item, filter) => {
      // let message = '';
      // switch (filter.name) {
      //   case 'queueLimit':
      //     message = 'Permitido o envio de no máximo ' + queueLimit + ' arquivos';
      //     break;
      //   case 'fileSize':
      //     message = 'O arquivo ' + item.name + ' possui ' + formatBytes(item.size) + ' que ultrapassa o tamanho máximo permitido de ' + formatBytes(maxFileSize);
      //     break;
      //   default:
      //     message = 'Erro tentar incluir o arquivo';
      //     break;

      this._cloudinaryS.formatInvalidError("img");
    };

    // Create / Update
    if (this.data) {
      this.postModalTitle = this.data.action;
      if (this.data.idPost && this.data.idPost !== "") {
        this.subscriptionsArray.push(
          this._postsS.getPost(this.data.idPost).subscribe((post: Post) => {
            this._cloudinaryS.image = post.img;
            this.form.patchValue({
              content: post.content,
              title: post.title,
              external_sources: post.external_sources,
              _id: post._id,
            });
          })
        );
      } else {
        this._cloudinaryS.image = "no_image";
        this.form.reset();
      }
    }
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  clearImg() {
    this._cloudinaryS.image = null;
  }

  closeModal() {
    this.form.reset();
    this._cloudinaryS.uploader.clearQueue();
    this.clearImg();
    this.dialogRef.close();
  }

  create() {
    if (this.form.value._id !== null) {
      if (this._cloudinaryS.uploader.queue.length === 0) {
        // Update jus data from existing Article
        this.subscriptionsArray.push(
          this._postsS
            .updatePost(this.form.value._id, this.createPostObject(), "")
            .subscribe(() => {
              this._postsS.notifica.emit({ render: true });
              this.closeModal();
            })
        );
      }
      // Update data and image from existing post
      else {
        this._cloudinaryS.setFileType("post");
        this._cloudinaryS.uploader.uploadAll();
        this.isPostUpdating = true;
      }
      // Create New Post
    } else {
      // Create post with just data
      if (this._cloudinaryS.uploader.queue.length === 0) {
        this.subscriptionsArray.push(
          this._postsS.createPost(this.createPostObject(), "").subscribe(() => {
            this.form.reset();
            this._postsS.notifica.emit({ render: true });
            this.closeModal();
          })
        );
      }
      // Create post with data and image
      else {
        this._cloudinaryS.setFileType("post");
        this._cloudinaryS.uploader.uploadAll();
        this.isPostUpdating = false;
      }
    }
  }

  // Create New Post After Cloudinary Response
  createNewPostAfterResponse(image: any) {
    if (!this.isPostUpdating) {
      this.subscriptionsArray.push(
        this._postsS
          .createPost(this.createPostObject(), image)
          .subscribe((resp) => {
            if (resp.ok) {
              this._postsS.notifica.emit({ render: true });
              this.closeModal();
            }
          })
      );
    } else {
      this.subscriptionsArray.push(
        this._postsS
          .updatePost(this.form.value._id, this.createPostObject(), image)
          .subscribe((resp) => {
            if (resp) {
              this.imgData = null;
              this._postsS.notifica.emit({ render: true });
              this.closeModal();
            }
          })
      );
    }
  }

  // Create Post Object Within Form Data
  createPostObject(): Post {
    // Add external sources Property If Its Not Empty
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

    return post;
  }

  imageValidation($event) {
    this._cloudinaryS.imageValidation($event);
  }

  private initArticulosForm() {
    this.form = new FormGroup({
      content: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          AngularEditorValidator.required(),
        ])
      ),
      external_sources: new FormControl(null),
      img: new FormControl(null),
      title: new FormControl(null, Validators.required),
      _id: new FormControl(null),
    });
  }
}

class AngularEditorValidator {
  static required(): ValidatorFn {
    return (currentControl: AbstractControl): ValidationErrors | null => {
      if (currentControl.value === "<br>") {
        return { required: true };
      }
      return null;
    };
  }
}
