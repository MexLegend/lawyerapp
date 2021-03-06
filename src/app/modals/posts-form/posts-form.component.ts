import {
  Component,
  Input,
  OnInit,
  Inject,
  HostListener,
  ViewChildren,
  QueryList,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";

import { CloudinaryService } from "../../services/cloudinary.service";
import { Post } from "../../models/Post";
import { PostsService } from "../../services/posts.service";
import { UpdateDataService } from "../../services/updateData.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatSelect,
} from "@angular/material";
import { Subscription, Subject, ReplaySubject } from "rxjs";
import { UtilitiesService } from "../../services/utilities.service";
import { ReferencesComponent } from "../references/references.component";
import { PracticeAreasService } from "../../services/practice-areas.service";
import { PracticeAreasFormComponent } from "../practice-areas-form/practice-areas-form.component";
import { ViewChild } from "@angular/core";
import { take, takeUntil } from "rxjs/operators";
import * as DocumentEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: "app-posts-form",
  templateUrl: "./posts-form.component.html",
  styleUrls: ["./posts-form.component.css"],
})
export class PostsFormComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PostsFormComponent>,
    public _cloudinaryS: CloudinaryService,
    private _postsS: PostsService,
    private _practiceAreaS: PracticeAreasService,
    public _updateDS: UpdateDataService,
    public _utilitiesS: UtilitiesService
  ) {}

  subscriptionsArray: Subscription[] = [];

  @ViewChildren("categoriesCheckbox")
  private categoriesCheckbox: QueryList<any>;
  @Input() editor: any;

  external_sourcesLabel: any;

  public Editor = ClassicEditor;

  // editorConfig: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: "auto",
  //   minHeight: "0",
  //   maxHeight: "auto",
  //   width: "auto",
  //   minWidth: "0",
  //   translate: "yes",
  //   enableToolbar: true,
  //   showToolbar: true,
  //   placeholder: "Escribe tu artículo aquí*",
  //   defaultParagraphSeparator: "",
  //   defaultFontName: "",
  //   defaultFontSize: "",
  //   fonts: [
  //     { class: "arial", name: "Arial" },
  //     { class: "times-new-roman", name: "Times New Roman" },
  //     { class: "calibri", name: "Calibri" },
  //     { class: "comic-sans-ms", name: "Comic Sans MS" },
  //   ],
  //   customClasses: [
  //     {
  //       name: "Citar",
  //       class: "Citar",
  //       tag: "blockquote",
  //     },
  //   ],
  //   sanitize: true,
  //   toolbarPosition: "top",
  //   toolbarHiddenButtons: [
  //     ["cut", "copy", "delete", "undo", "redo"],
  //     ["subscript", "superscript", "indent", "outdent"],
  //     [
  //       "fontSize",
  //       "textColor",
  //       "backgroundColor",
  //       "insertImage",
  //       "insertVideo",
  //       "insertHorizontalRule",
  //       "removeFormat",
  //       "toggleEditorMode",
  //     ],
  //   ],
  // };

  basicDataForm: FormGroup;
  categories: Array<any> = [];
  checkboxAction: string = "Seleccionar";
  imgData: any = null;
  filterValue: string;
  innerScreenWidth: any;
  isPostUpdating: boolean = false;
  mobileFilterActivated: boolean = false;
  postModalTitle: string;
  postAttachedFilesList: any = [];
  postQuotesList: any = [];
  titleLabel: any;

  public config: PerfectScrollbarConfigInterface = {};

  /** Subject That Emits When The Component Has Been Destroyed. */
  protected _onDestroy = new Subject<void>();

  /** Control For The MatSelect Filter Keyword Multi-Selection */
  public categoriesFilterCtrl: FormControl = new FormControl();

  /** List Of Array Items Filtered By Search Keyword */
  public categoriesMulti: ReplaySubject<Array<any>> = new ReplaySubject<
    Array<any>
  >(1);

  public tooltipMessage = "Select All / Unselect All";

  @ViewChild("categoriesSelect", { static: true })
  categoriesSelect: MatSelect;

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.innerScreenWidth = window.innerWidth;
    if (this.innerScreenWidth > 520) {
      this.mobileFilterActivated = false;
    }
  }

  ngOnInit() {
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

    this.initArticulosForm();

    // Init Cloudinary Uploader Options - Post Img / Attached Files
    this._cloudinaryS.uploaderSend("image");

    // Get Cloudinary File Uploaded Response
    this.subscriptionsArray.push(
      this._cloudinaryS.getFile().subscribe(({ url, public_id }) => {
        this.createNewPostAfterResponse({ url, public_id });
      })
    );

    // Validate Duplicated Queue Files
    this._cloudinaryS.uploader.onAfterAddingFile = (item) => {
      item.remove();
      if (
        this._cloudinaryS.uploader.queue.filter(
          (f) => f._file.name == item._file.name
        ).length == 0
      ) {
        this._cloudinaryS.uploader.queue.push(item);
      } else {
        this._cloudinaryS.duplicatedFileError(item._file.name);
      }
    };

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

    // Listen For Search Field Value Changes
    this.categoriesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterArrayMulti();
      });

    // Get Categories Supcription
    this.subscriptionsArray.push(
      this._practiceAreaS.getPracticeAreas("ALL", true).subscribe()
    );

    // List Categories Subscription
    this.subscriptionsArray.push(
      this._practiceAreaS
        .getPracticeAreasList()
        .subscribe(([practiceAreasList, action]) => {
          practiceAreasList.map(
            (practiceArea) =>
              (this.categories = this._utilitiesS.upsertArrayItems(
                this.categories,
                practiceArea,
                action
              ))
          );

          // Load The Initial Array Items List
          this.categoriesMulti.next(this.categories.slice());
          this.setInitialValue();
        })
    );

    // Get Attached Files List
    this.subscriptionsArray.push(
      this._postsS
        .getPostAttachedFilesList()
        .subscribe(([attachedFiles, action]) =>
          attachedFiles.map(
            (attachedFile: any) =>
              (this.postAttachedFilesList = this._utilitiesS.upsertArrayItems(
                this.postAttachedFilesList,
                attachedFile,
                action
              ))
          )
        )
    );

    // Get Quotes List
    this.subscriptionsArray.push(
      this._practiceAreaS
        .getReferencesList()
        .subscribe(([quotes, action]) =>
          quotes.map(
            (quote: any) =>
              (this.postQuotesList = this._utilitiesS.upsertArrayItems(
                this.postQuotesList,
                quote,
                action
              ))
          )
        )
    );

    // Create / Update
    if (this.data) {
      this.postModalTitle = this.data.action;
      if (this.data.idPost && this.data.idPost !== "") {
        this.subscriptionsArray.push(
          this._postsS.getPost(this.data.idPost).subscribe((post: Post) => {
            this._cloudinaryS.image = post.img;
            this.basicDataForm.patchValue({
              content: post.content,
              title: post.title,
              categories: post.categories,
              _id: post._id,
            });
          })
        );
      } else {
        this._cloudinaryS.image = "no_image";
        this.basicDataForm.reset();
      }
    }
  }

  /*
  ngAfterViewInit(): void {
    DocumentEditor.create(document.querySelector("#editor"))
      .then((editor: any) => {
        // The toolbar needs to be explicitly appended.
        document
          .querySelector("#toolbar-container")
          .appendChild(editor.ui.view.toolbar.element);
      })
      .catch((error: any) => {
        console.error("There was a problem initializing the editor.", error);
      });
  }*/

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  checkUncheck(checkboxHandler: any, action: string) {
    this.categoriesCheckbox.toArray().map((checkbox: any) => {
      if (action === "selectAll") {
        if (checkboxHandler.checked) {
          checkbox.checked = true;
          this.checkboxAction = "Deseleccionar";
        } else {
          checkbox.checked = false;
          this.checkboxAction = "Seleccionar";
        }
      } else {
        checkboxHandler.map((item: any) =>
          item._id === checkbox.value
            ? (checkbox.checked = true)
            : checkbox.checked
        );
      }
    });
  }

  clearImg() {
    this._cloudinaryS.image = null;
  }

  closeModal() {
    this.basicDataForm.reset();
    this._cloudinaryS.uploader.clearQueue();
    this.clearImg();
    this.dialogRef.close();
  }

  createOrUpdatePost() {
    if (this.basicDataForm.value._id !== null) {
      if (this._cloudinaryS.uploader.queue.length === 0) {
        // Update jus data from existing Article
        this.subscriptionsArray.push(
          this._postsS
            .updatePost(
              this.basicDataForm.value._id,
              this.createPostObject(),
              ""
            )
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
            this.basicDataForm.reset();
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
          .updatePost(
            this.basicDataForm.value._id,
            this.createPostObject(),
            image
          )
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
      this.basicDataForm.value.external_sources === undefined ||
      this.basicDataForm.value.external_sources === null ||
      this.basicDataForm.value.external_sources === ""
        ? ""
        : this.basicDataForm.value.external_sources;

    const post = new Post(
      this.basicDataForm.value.content,
      this.basicDataForm.value.title,
      null,
      externalS
    );

    return post;
  }

  // Pop Item From Quotes / Attached Files Array
  deleteElementFromArray(item: any, arrayType: string) {
    if (arrayType === "Quote") {
      this._practiceAreaS.setReferencesList([item], "delete");
    } else {
      this._postsS.setPostAttachedFilesList([item], "delete");
    }
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this._cloudinaryS.uploader.queue.splice(index, 1);
  }

  // Filter Post Categories By Condition
  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  imageValidation($event: any) {
    this._cloudinaryS.imageValidation($event);
  }

  private initArticulosForm() {
    this.basicDataForm = new FormGroup({
      content: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          AngularEditorValidator.required(),
        ])
      ),
      img: new FormControl(null),
      title: new FormControl(null, Validators.required),
      categories: new FormControl(null),
      _id: new FormControl(null),
    });
  }

  // Open Practice Areas Modal
  openPracticeAreasModal() {
    let dialogRef = this.dialog.open(PracticeAreasFormComponent, {
      id: "categoryModal",
      panelClass: "categoryModal",
      data: {
        action: "Crear Categoria",
        type: "Simple",
        is_category: true,
      },
      width: "600px",
      height: "max-content",
      autoFocus: false,
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   localStorage.removeItem('userData');
    //   localStorage.removeItem('fileData');
    //   this._updateDS.setUserData(null);
    // });
  }

  // Open Quotes Modal
  openQuotesModal(referenceData?: string, action?: string) {
    let dialogRef =
      referenceData && referenceData !== ""
        ? this.dialog.open(ReferencesComponent, {
            id: "QuoteModal",
            data: { referenceData, action: "Editar", type: "Cita" },
            autoFocus: false,
            width: "600px",
          })
        : this.dialog.open(ReferencesComponent, {
            id: "QuoteModal",
            data: { action: "Agregar", type: "Cita" },
            autoFocus: false,
            width: "600px",
          });

    // dialogRef.afterClosed().subscribe(result => {
    //   localStorage.removeItem('userData');
    //   localStorage.removeItem('fileData');
    //   this._updateDS.setUserData(null);
    // });
  }

  uploadAttachedFilesCloudinary() {
    this._cloudinaryS.setFileType("AttachedPostFile");
    this._cloudinaryS.uploader.uploadAll();
  }

  /**
   * Sets The Initial Value After The Array Items Are Loaded Initially
   */
  protected setInitialValue() {
    this.categoriesMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        if (this.categoriesSelect)
          this.categoriesSelect.compareWith = (a: any, b: any) =>
            a && b && a._id === b._id;
      });
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.categoriesMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((arrayList) => {
        if (selectAllValue) {
          this.basicDataForm.controls["categories"].setValue([
            ...arrayList.map((arrayItem: any) => arrayItem),
          ]);
        } else {
          this.basicDataForm.controls["categories"].setValue([]);
        }
      });
  }

  protected filterArrayMulti() {
    if (!this.categories) {
      return;
    }
    // Get The Search Keyword
    let search = this.categoriesFilterCtrl.value;
    if (!search) {
      this.categoriesMulti.next(this.categories.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // Filter The Array Items
    this.categoriesMulti.next(
      this.categories.filter(
        (category) => category.name.toLowerCase().indexOf(search) > -1
      )
    );
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
