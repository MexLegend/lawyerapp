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
import * as Editor from "../../../app/components/custom_editor/build/ckeditor";
import { Quote } from "../../models/quote";

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
  @ViewChild("categoriesSelect", { static: true })
  categoriesSelect: MatSelect;
  @Input() editor: any;

  Editor = Editor;
  basicDataForm: FormGroup;
  categories: Array<any> = [];
  checkboxAction: string = "Seleccionar";
  cloudinaryUploadingType: string = "";
  config: PerfectScrollbarConfigInterface = {};
  filterValue: string;
  innerScreenWidth: any;
  isPostUpdating: boolean = false;
  mobileFilterActivated: boolean = false;
  postAttachedFilesList: any = [];
  postModalTitle: string;
  postQuotesList: Array<Quote> = [];
  titleLabel: any;

  /** Subject That Emits When The Component Has Been Destroyed. */
  protected _onDestroy = new Subject<void>();
  /** Control For The MatSelect Filter Keyword Multi-Selection */
  public categoriesFilterCtrl: FormControl = new FormControl();
  /** List Of Array Items Filtered By Search Keyword */
  public categoriesMulti: ReplaySubject<Array<any>> = new ReplaySubject<
    Array<any>
  >(1);
  public tooltipMessage = "Select All / Unselect All";

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

    // Init Cloudinary Uploader Options - Post Image / File
    this._cloudinaryS.uploaderSend();

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

      this._cloudinaryS.formatInvalidError();
    };

    // Get Cloudinary File Uploaded Response
    this.subscriptionsArray.push(
      this._cloudinaryS
        .getFile()
        .subscribe(({ url, public_id, size, name, context }) => {
          console.log(context);
          this.createNewPostAfterResponse({ url, public_id });
        })
    );

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
      this._cloudinaryS
        .getGlobalAttachedFilesList()
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
        .getQuotesList()
        .subscribe(([quotes, action]) =>
          quotes.map(
            (quote: Quote) =>
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

      if (this.data.postData && this.data.postData !== "") {
        const {
          _id,
          postImage,
          postTitle,
          postContent,
          postCategories,
          ...postData
        } = this.data.postData;
        this._cloudinaryS.image = postImage;

        // Filter Just Categories Data
        const postCategoriesList = postCategories.map(({ category }) => ({
          ...category,
        }));

        // Initialize Post Details With Obtained Data
        this.basicDataForm.patchValue({
          _id,
          postTitle,
          postContent,
          postCategories: [...postCategoriesList],
        });

        // Set Attached Files List With Obtained Data
        if (postData.attachedFiles) {
          this._cloudinaryS.setGlobalAttachedFilesList(
            postData.attachedFiles,
            "list"
          );
        }

        // Set Quotes List With Obtained Data
        if (postData.postQuotes) {
          this._practiceAreaS.setQuotesList(postData.postQuotes, "list");
        }
      } else {
        this._cloudinaryS.image = "no_image";
        this.basicDataForm.reset();
      }
    }
  }

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
        // Update just data from existing Article
        this.subscriptionsArray.push(
          this._postsS.updatePost(this.createPostObject()).subscribe(() => {
            this._postsS.notifica.emit({ render: true });
            this.closeModal();
          })
        );
      }
      // Update data and image from existing post
      else {
        this._cloudinaryS.configurateUploaderBeforeUpload().then((resp) => {
          if (resp) {
            this._cloudinaryS.setFileType("post");
            this._cloudinaryS.uploader.uploadAll();
            this.isPostUpdating = true;
          } else {
            console.log("Error al configurar el uploader");
          }
        });
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
        this._cloudinaryS.configurateUploaderBeforeUpload().then((resp) => {
          if (resp) {
            this._cloudinaryS.setFileType("post");
            this._cloudinaryS.uploader.uploadAll();
            this.isPostUpdating = false;
          } else {
            console.log("Error al configurar el uploader");
          }
        });
      }
    }
  }

  // Create / Update New Post After Cloudinary Response
  createNewPostAfterResponse(image: any) {
    // Create Post
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
    }
    // Update Post
    else {
      this.subscriptionsArray.push(
        this._postsS
          .updatePost(this.createPostObject(), image)
          .subscribe((resp) => {
            if (resp) {
              this._postsS.notifica.emit({ render: true });
              this.closeModal();
            }
          })
      );
    }
  }

  // Create Post Object With Form Data
  createPostObject(): Object {
    // Filter Ids From Categories List
    const postCategories = this.basicDataForm.value.postCategories.map(
      ({ _id: idCategory, ...categoryData }) => ({
        category: idCategory,
      })
    );

    // Filter Data From Quotes List
    const postQuotes = this.postQuotesList.map(
      ({ _id: idQuote, ...quoteData }) => ({
        ...quoteData,
      })
    );

    const post = {
      ...{ ...this.basicDataForm.value, postCategories },
      attachedFiles: this.postAttachedFilesList,
      postQuotes: postQuotes,
    };

    return post;
  }

  // Pop Item From Quotes / Attached Files / Multiple Images Array
  deleteElementFromArray(item: any, arrayType: string) {
    if (arrayType === "Quote") {
      this._practiceAreaS.setQuotesList([item], "delete");
    } else {
      this._cloudinaryS.deleteItemFromArray(item, arrayType);
    }
  }

  // Filter Post Categories By Condition
  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
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
      postCategories: new FormControl(null, Validators.required),
      postContent: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          AngularEditorValidator.required(),
        ])
      ),
      postTitle: new FormControl(null, Validators.required),
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
      autoFocus: true,
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   localStorage.removeItem('userData');
    //   localStorage.removeItem('fileData');
    //   this._updateDS.setUserData(null);
    // });
  }

  // Open Quotes Modal
  openQuotesModal(quoteData?: string, action?: string) {
    let dialogRef =
      quoteData && quoteData !== ""
        ? this.dialog.open(ReferencesComponent, {
            id: "QuoteModal",
            data: { quoteData, action: "Editar", type: "Cita" },
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

  renderEditorToolbar(editor: any) {
    // Get Last Toolbar Group Separator Element
    const lastToolbarGroupSeparator = Array.from(
      editor.ui.view.toolbar.element.children[0].querySelectorAll(
        ".ck-toolbar__separator"
      )
    ).pop();

    // Insert Image Button To Toolbar
    editor.ui.view.toolbar.element.children[0].insertBefore(
      this._utilitiesS.insertImageButton(editor),
      lastToolbarGroupSeparator
    );

    // Append Toolbar
    document
      .querySelector(".document-editor__toolbar")
      .append(editor.ui.view.toolbar.element);

    // Append Editor Container
    // document
    //   .querySelector(".document-editor__editable-container")
    //   .append(editor.ui.view.editable.element);
  }

  setCloudinaryUploadType(
    actionType: string,
    fileType: string,
    fileId: string
  ) {
    // Set Cloudinary Uploader File Type - Image
    this._cloudinaryS.setFileUploadType(actionType, fileType, fileId);
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

  uploadAttachedFilesCloudinary() {
    this._cloudinaryS.configurateUploaderBeforeUpload().then((resp) => {
      if (resp) {
        this._cloudinaryS.setFileType("AttachedPostFile");
        this._cloudinaryS.uploader.uploadAll();
      } else {
        console.log("Error al configurar el uploader");
      }
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
