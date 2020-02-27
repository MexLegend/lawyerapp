import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ArticulosService } from '../../services/articulos.service';
import { Articulo } from '../../models/Articulo';
import { UpdateDataService } from '../../services/updateData.service';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-articulos-form',
  templateUrl: './articulos-form.component.html',
  styleUrls: ['./articulos-form.component.css']
})
export class ArticulosFormComponent implements OnInit {

  constructor(
    private _articulosS: ArticulosService,
    public _uS: UpdateDataService
  ) { }

  @Input() editor: any;
  form: FormGroup;
  subscription: Subscription;
  titleLabel: any;
  authorLabel: any;

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

  ngOnInit() {
    this.initArticulosForm();

    // Create / Update Subscription
    this.subscription = this._uS.getArticleId().subscribe(id => {
      this._articulosS.obtenerArticulo(id).subscribe(r => {
        if (id !== '') {
          $('.article-action').text('Actualizar');
          this.form.patchValue({
            author: r.author,
            content: r.content,
            title: r.title,
            _id: r._id
          })
        } else {
          this.form.reset();
        }
      })
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  crear() {
    if (this.form.value._id !== null) {
      // Update Article
      this._articulosS.actualizarArticulo(this.form.value._id, this.form.value).subscribe((r) => {
        this._articulosS.notifica.emit({ render: true })
      });
    } else {
      // Create Article
      if (this.form.value.content !== null) {
        const articulo = new Articulo(
          this.form.value.author,
          this.form.value.content,
          this.form.value.title,
          null,
          this.form.value.img
        );

        this._articulosS.crearArticulo(articulo).subscribe(resp => {
          this.form.reset();
          this._articulosS.notifica.emit({ render: true })
        })
      } else {
        $('.angular-editor-textarea').focus();
      }
    }
  }

  private initArticulosForm() {
    this.form = new FormGroup({
      author: new FormControl(null, Validators.required),
      content: new FormControl(null, Validators.compose([
        Validators.required,
        AngularEditorValidator.required()
      ])),
      img: new FormControl(null),
      title: new FormControl(null, Validators.required),
      _id: new FormControl(null)
    });
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
