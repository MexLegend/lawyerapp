import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ArticulosService } from '../../services/articulos.service';
import { Articulo } from '../../models/Articulo';

@Component({
  selector: 'app-articulos-form',
  templateUrl: './articulos-form.component.html',
  styleUrls: ['./articulos-form.component.css']
})
export class ArticulosFormComponent implements OnInit {

  form: FormGroup;
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
    placeholder: 'Enter text here...',
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

  constructor(
    private _articulosS: ArticulosService
  ) { }

  ngOnInit() {
    this.initArticulosForm();
  }

  private initArticulosForm() {
    this.form = new FormGroup({
      author: new FormControl(null),
      content: new FormControl(null, Validators.required),
      img: new FormControl(null),
      title: new FormControl(null, Validators.required)
    });
  }

  crear() {
    console.log(this.form)

    const articulo = new Articulo(
      this.form.value.content,
      this.form.value.title,
      this.form.value.author,
      null,
      this.form.value.img,
    );

    this._articulosS.crear(articulo).subscribe(resp => {
      console.log(resp);
      this.form.reset();
    })
  }

}
