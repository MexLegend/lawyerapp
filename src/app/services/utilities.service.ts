import { environment } from "../../environments/environment";
import { Injectable, Inject } from "@angular/core";
import { Observable, throwError, Subject } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { MatDialog, MatTabGroup } from "@angular/material";
import { LoginComponent } from "../modals/login/login.component";
import { CloudinaryService } from "./cloudinary.service";
import { DOCUMENT } from "@angular/common";

declare var $: any;

@Injectable({
  providedIn: "root",
})
export class UtilitiesService {
  constructor(
    @Inject(DOCUMENT) private document: any,
    public dialog: MatDialog,
    private http: HttpClient
  ) {}

  private arraysList = new Subject<[Array<any>, string, string]>();
  private clientShowMoreIndex = new Subject<any>();
  private loaderComponentsList = new Subject<Array<number>>();
  private isModalAlertRendered = new Subject<boolean>();
  private showMoreIndex = new Subject<any>();
  private sidenavShowMoreIndex = new Subject<any[]>();
  private tempCompleteArray: Array<any> = [];

  // Allow New Attributes To CkEditor
  allowCKEditorAttributes(editor: any) {
    editor.model.schema.extend("image", { allowAttributes: "data-ide" });

    editor.conversion.for("upcast").attributeToAttribute({
      view: "data-ide",
      model: "data-ide",
    });

    editor.conversion.for("downcast").add((dispatcher) => {
      dispatcher.on("attribute:data-ide:image", (evt, data, conversionApi) => {
        if (!conversionApi.consumable.consume(data.item, evt.name)) {
          return;
        }

        const viewWriter = conversionApi.writer;
        const figure = conversionApi.mapper.toViewElement(data.item);
        const img = figure.getChild(0);

        if (data.attributeNewValue !== null) {
          viewWriter.setAttribute("data-ide", data.attributeNewValue, img);
        } else {
          viewWriter.removeAttribute("data-ide", img);
        }
      });
    });
  }

  checkToken(token: string): Observable<any> {
    const url = `${environment.URI}/api/utilities/check-token/${token}`;

    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  /* Close fullscreen */
  closeFullscreen(): Promise<boolean> {
    // Check If Browser Is In Full Screen Mode
    if (window.innerHeight === screen.height) {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
    return new Promise((resolve) => resolve(true));
  }

  // Disable Body Scroll
  disableBodyScroll() {
    document.getElementsByTagName("html")[0].classList.add("hide-scroll");
    document.querySelector("body").classList.add("hide-scroll");
  }

  // Enable Body Scroll
  EnableBodyScroll() {
    document.getElementsByTagName("html")[0].classList.remove("hide-scroll");
    document.querySelector("body").classList.remove("hide-scroll");
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  // Admin View Show More Functions
  getShowMoreIndexSub(): Observable<any> {
    return this.showMoreIndex.asObservable();
  }

  setShowMoreIndexSub(index: number) {
    this.showMoreIndex.next(index);
  }

  // Carousel Functions
  getCarouselElementsAndMeasures(
    elementsArray: any[],
    elementRef: any,
    firstElement: any
  ): any {
    let elementsArrayLength: number;
    let elementsPerPage: number;
    let pagesNumber: number;
    let scrollMeasure: number;

    elementsArrayLength = elementsArray.length;
    elementsPerPage =
      elementRef.nativeElement.offsetWidth / firstElement.offsetWidth;
    pagesNumber = Math.ceil(elementsArrayLength / elementsPerPage);
    scrollMeasure = elementsPerPage * firstElement.offsetWidth;

    return [pagesNumber, scrollMeasure];
  }

  setCarouselRowControlsVisibility(
    rowIndicatorType: string,
    visibility: string
  ) {
    const rowControls: any = document.querySelectorAll(rowIndicatorType);
    [...rowControls].forEach((control) => {
      if (visibility === "hide") {
        control.style.display = "none";
      } else {
        control.style.display = "flex";
      }
    });
  }

  setCarouselPaginationControls(
    elementsArray: any[],
    elementRef: any,
    controlsType: string,
    firstElement: any,
    rowIndicatorType: string
  ): Promise<number> {
    const [pagesNumber, scrollMeasure] = this.getCarouselElementsAndMeasures(
      elementsArray,
      elementRef,
      firstElement
    );

    if (pagesNumber >= 2) {
      const paginationControlContainer = document.querySelector(controlsType);

      paginationControlContainer.innerHTML = "";
      this.setCarouselRowControlsVisibility(rowIndicatorType, "show");

      // Align To Flex-Start Accordion Card Content
      if (rowIndicatorType === ".partners-row-indicator") {
        const accordionCardContent = document.querySelector(
          ".item-acordion-card-main-container.lawyer-card"
        );
        accordionCardContent.setAttribute("data-scrolling", "true");
      }

      for (let index = 0; index < pagesNumber; index++) {
        const paginationControl = document.createElement("button");
        const offSetWidth: Number =
          elementRef.nativeElement.offsetWidth * index;

        if (index === 0) {
          paginationControl.classList.add("activo");
        }

        paginationControl.addEventListener("click", (e: any) => {
          this.scrollCarouselToRight(
            elementsArray,
            elementRef,
            controlsType,
            firstElement,
            offSetWidth
          );
          document
            .querySelector(controlsType + " .activo")
            .classList.remove("activo");
          e.target.classList.add("activo");
        });

        paginationControlContainer.appendChild(paginationControl);
      }
    } else {
      const paginationControlContainer = document.querySelector(controlsType);
      paginationControlContainer.innerHTML = "";
      this.setCarouselRowControlsVisibility(rowIndicatorType, "hide");

      // Center Accordion Card Content
      if (rowIndicatorType === ".partners-row-indicator") {
        const accordionCardContent = document.querySelector(
          ".item-acordion-card-main-container.lawyer-card"
        );
        accordionCardContent.setAttribute("data-scrolling", "false");
      }
    }
    return new Promise((resolve) => resolve(pagesNumber));
  }

  scrollCarouselToRight(
    elementsArray: any[],
    elementRef: any,
    controlsType: string,
    firstElement: any,
    offsetWidth?: any
  ) {
    const [pagesNumber, scrollMeasure] = this.getCarouselElementsAndMeasures(
      elementsArray,
      elementRef,
      firstElement
    );

    const activeControl: any = document.querySelector(
      controlsType + " .activo"
    );

    if (offsetWidth >= 0) {
      elementRef.nativeElement.scrollLeft = offsetWidth;
    } else {
      if (activeControl.nextSibling) {
        activeControl.nextSibling.classList.add("activo");
        activeControl.classList.remove("activo");
      }
      elementRef.nativeElement.scrollLeft += scrollMeasure;
    }
  }

  scrollCarouselToLeft(
    elementsArray: any[],
    elementRef: any,
    controlsType: string,
    firstElement: any
  ) {
    const [pagesNumber, scrollMeasure] = this.getCarouselElementsAndMeasures(
      elementsArray,
      elementRef,
      firstElement
    );

    const activeControl: any = document.querySelector(
      controlsType + " .activo"
    );
    if (activeControl.previousSibling) {
      activeControl.previousSibling.classList.add("activo");
      activeControl.classList.remove("activo");
    }
    elementRef.nativeElement.scrollLeft -= scrollMeasure;
  }

  // Client View Show More Functions
  getClientShowMoreIndexSub(): Observable<any> {
    return this.clientShowMoreIndex.asObservable();
  }

  setClientShowMoreIndexSub(index: number) {
    this.clientShowMoreIndex.next(index);
  }

  // Sidenav Show More Functions
  getSidenavShowMoreIndexSub(): Observable<any> {
    return this.sidenavShowMoreIndex.asObservable();
  }

  setSidenavShowMoreIndexSub(index: number, type: string) {
    this.sidenavShowMoreIndex.next([index, type]);
  }

  // Generate Random Default 15 Characters Password
  generateRandomPass(length: Number = 15): string {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Go to Post Comments Section
  goToComments(id: string, router: Router): void {
    router.navigate([`/articulo-detalle/${id}`]);

    $(document).ready(() => {
      // scroll to your element
      document.getElementById("comments-box").scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    });
    // now account for fixed header
    // var scrolledY = window.scrollY;

    // if (scrolledY) {
    //   window.scroll(0, scrolledY - 71);
    // }
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  // Scroll to Top of New Page
  scrollToTop() {
    window.scrollTo(0, 0);
  }

  // Show Modal Alert When The User Who Is Reacting Is Not Logged In
  showAlertModal(
    action: string,
    modalService: any,
    modalState: boolean,
    event: any,
    fileName?: any
  ) {
    let title: string = null;
    let text: string = null;

    event.stopPropagation();

    switch (action) {
      case "attachedFile":
        title = `¿Deseas descargar ${fileName}?`;
        text = "Inicia sesión para descargar este y más archivos.";
        break;

      case "comment":
        title = "¿Deseas comentar este artículo?";
        text = "Inicia sesión para compartir tu opinión.";
        break;

      case "contactEmail":
        title = "¿Deseas contactar al abogado?";
        text = "Inicia sesión para contactarlo por correo.";
        break;

      case "contactLawyer":
        title = "¿Deseas contactar al abogado?";
        text = "Inicia sesión para contactarlo directamente.";
        break;

      case "like": {
        title = "¿Te gusta este artículo?";
        text = "Inicia sesión para hacer que tu opinión cuente.";
        break;
      }

      case "rate":
        title = "¿Deseas calificar al abogado?";
        text = "Inicia sesión para compartir tu calificación.";
        break;

      default:
        title = "¿No te gusta este artículo?";
        text = "Inicia sesión para hacer que tu opinión cuente.";
        break;
    }

    Swal.fire({
      customClass: { container: "reactionModal" },
      title,
      text,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#2e89ff",
      confirmButtonText: "Iniciar sesión",
      backdrop: false,
      allowOutsideClick: false,
      onOpen: () => {
        this.setModalAlertState(true);
        modalService.setModalAlertRef(Swal);
      },
      onClose: () => this.setModalAlertState(false),
    }).then((result) => {
      if (result.value) {
        this.openLoginModal(0);
      }
    });
  }

  // Show Social Media Of Haizen
  showSocialMedia(route: string): boolean {
    const show =
      ["/inicio", "/contacto", "/areas-practica", "/articulos"].indexOf(route) >
      -1
        ? true
        : false;

    return show;
  }

  // Modal Alert State Functions
  getModalAlertState(): Observable<any> {
    return this.isModalAlertRendered.asObservable();
  }

  setModalAlertState(state: boolean) {
    this.isModalAlertRendered.next(state);
  }

  // Login Modal Functions
  openLoginModal(activeModalTab: Number) {
    let dialogRef = this.dialog.open(LoginComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: "modalRegistro",
    });
    dialogRef.componentInstance.selected.setValue(activeModalTab);

    const loginModalOpenedRef = dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance.modalRef = dialogRef;
      document.getElementsByTagName("html")[0].classList.add("hide-scroll");
      document.querySelector("body").classList.add("hide-scroll");
    });

    const loginModalClosedRef = dialogRef.afterClosed().subscribe(() => {
      document.getElementsByTagName("html")[0].classList.remove("hide-scroll");
      document.querySelector("body").classList.remove("hide-scroll");
      loginModalOpenedRef.unsubscribe();
      loginModalClosedRef.unsubscribe();
    });
  }

  // Open WhatsApp
  openWhatsApp() {
    window.open(
      `https://api.whatsapp.com/send?phone=523481055088&text=Hola Haizen, podrían ayudarme?`,
      "_blank"
    );
  }

  // Set Active Tabs
  setActiveTab(tabGroup: MatTabGroup, activeTab: number) {
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;

    tabGroup.selectedIndex = activeTab;
  }

  // Filter Array
  filterArray(filterValue: any, filterType?: string): any {
    let tempArray: any;

    if (filterType) {
      tempArray = this.tempCompleteArray.filter((arrayItem: any) =>
        arrayItem[filterType].toLowerCase().includes(filterValue.toLowerCase())
      );
    } else {
      tempArray = this.tempCompleteArray.filter((arrayItem: any) =>
        arrayItem.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return tempArray;
  }

  /**
   * Parse File Size
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals?) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  formatType(format: string): string {
    const imgExtensions = [
      "png",
      "jpg",
      "jpeg",
      "gif",
      "webp",
      "jfif",
      "tiff",
      "bmp",
    ];
    const wordExtensions = ["doc", "docx"];

    if (imgExtensions.includes(format.toLowerCase())) {
      return "image";
    } else if (wordExtensions.includes(format.toLowerCase())) {
      return "word";
    } else {
      return "pdf";
    }
  }

  // Get  Array List
  getLoaderComponentsList(): Observable<Array<number>> {
    return this.loaderComponentsList.asObservable();
  }

  setLoaderComponentsList(count: number) {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  setTempCompleteArray(completeArray: any) {
    this.tempCompleteArray = completeArray;
  }

  // Get Array Items List
  getArrayList(): Observable<[Array<any>, string, string]> {
    return this.arraysList.asObservable();
  }

  // Set Array Items List
  setArrayList(attachedFile: any, action: string, type: string) {
    this.arraysList.next([attachedFile, action, type]);
  }

  // Generate APA Quote
  generateAPAQuote(data: any): string {
    let APAQuote: string;

    switch (data.quoteType) {
      case "Sitio Web":
        APAQuote = `${
          this.getAuthorName(data.quoteAuthor) || data.quotePageName || ""
        }${data.quoteAuthor || data.quotePageName ? ". " : ""}(${
          this.getQuoteDate(data.quoteYear, data.quoteMonth, data.quoteDay) ||
          "s.f."
        }). ${
          data.quoteAuthor
            ? data.quotePageName
              ? data.quotePageName + ". "
              : "" || ""
            : ""
        }${
          "Obtenido de " +
          (data.quoteWebSiteName ? data.quoteWebSiteName + ": " : "" || "")
        }${data.quoteUrl}
        `;
        break;
      case "Libro":
        APAQuote = `${this.getAuthorName(data.quoteAuthor) || ""}${
          data.quoteAuthor ? ". " : ""
        }(${
          this.getQuoteDate(data.quoteYear, data.quoteMonth, data.quoteDay) ||
          "s.f."
        }). ${data.quoteTitle ? data.quoteTitle : ""}${
          data.quoteTitle ? ". " : ""
        }${data.quoteCity ? data.quoteCity : ""}${
          data.quotePublisher ? ": " : data.quoteCity ? "." : ""
        }${data.quotePublisher ? data.quotePublisher : ""}
        `;
        break;
      case "Caso":
        APAQuote = `${data.quoteTitle || ""}${
          data.quoteCaseNumber
            ? ", "
            : this.getQuoteDate(
                data.quoteYear,
                data.quoteMonth,
                data.quoteDay
              ) || data.quoteCourt
            ? " "
            : "."
        }${data.quoteCaseNumber ? data.quoteCaseNumber + " " : "" || ""}${
          data.quoteCourt ||
          this.getQuoteDate(data.quoteYear, data.quoteMonth, data.quoteDay)
            ? "("
            : ""
        }${data.quoteCourt ? data.quoteCourt + " " : "" || ""}${
          this.getQuoteDate(data.quoteYear, data.quoteMonth, data.quoteDay) ||
          ""
        }${
          data.quoteCourt ||
          this.getQuoteDate(data.quoteYear, data.quoteMonth, data.quoteDay)
            ? ")"
            : ""
        }
        `;
        break;
      case "Artículo de Revista":
        APAQuote = `${
          this.getAuthorName(data.quoteAuthor) || data.quoteTitle || ""
        }${data.quoteAuthor || data.quoteTitle ? ". " : ""}(${
          this.getQuoteDate(data.quoteYear) || "s.f."
        }). ${
          data.quoteAuthor
            ? data.quoteTitle
              ? data.quoteTitle + ". "
              : "" || ""
            : ""
        }${data.quoteJournalName ? data.quoteJournalName : ""}${
          data.quotePages ? ", págs. " : data.quoteJournalName ? "." : ""
        }${data.quotePages ? data.quotePages : ""}
        `;
        break;
      case "Artículo de Periódico":
        APAQuote = `${
          this.getAuthorName(data.quoteAuthor) || data.quoteTitle || ""
        }${data.quoteAuthor || data.quoteTitle ? ". " : ""}(${
          this.getQuoteDate(data.quoteYear, data.quoteMonth, data.quoteDay) ||
          "s.f."
        }). ${
          data.quoteAuthor
            ? data.quoteTitle
              ? data.quoteTitle + ". "
              : "" || ""
            : ""
        }${data.quotePeriodicalTitle ? data.quotePeriodicalTitle : ""}${
          data.quotePages ? ", págs. " : data.quotePeriodicalTitle ? "." : ""
        }${data.quotePages ? data.quotePages : ""}
        `;
        break;
      default:
        APAQuote = `${this.getAuthorName(data.quoteInventor) || ""}${
          data.quoteInventor ? ". " : ""
        }(${this.getQuoteDate(data.quoteYear) || "s.f."}). ${
          data.quoteCountry ? data.quoteCountry : ""
        }${data.quoteCountry ? ". " : ""}${
          data.quotePatentNumber
            ? "Patente n° " +
              (data.quotePatentNumber ? data.quotePatentNumber : "" || "")
            : ""
        }
        `;
        break;
    }

    return APAQuote;
  }

  // Get Quote Authors Names
  getAuthorName(fullName: string): string {
    let authorFirstName: string = "";
    let authorMiddleName: string = "";
    let authorLastName: string = "";

    if (fullName) {
      const names = fullName.split(" ");
      const initials = (name: any) => (name ? name : "");

      // Append LastName
      authorLastName = initials(names.pop());
      // Append FirstName Letter
      authorFirstName = initials(names.shift())[0] || "";
      authorFirstName ? (authorFirstName = ", " + authorFirstName) : "";
      // Append MiddleName Letter
      authorMiddleName = initials(names.join(" "))[0] || "";
      authorMiddleName ? (authorMiddleName = "." + authorMiddleName) : "";
    }

    return authorLastName + authorFirstName + authorMiddleName;
  }

  // Get Quote Date
  getQuoteDate(year: Number, month?: string, day?: Number): string {
    let date: string = "";
    if (day) date += day;
    if (day && (month || year)) date += " de ";
    if (month) date += month;
    if (month && year) date += " de ";
    if (year) date += year;

    return date;
  }

  // Get Screen Width And Height Size
  getScreenSize(): { width: number; height: number; isMobile: boolean } {
    const innerScreenWidth = window.innerWidth;
    const innerScreenHeight = window.innerHeight;
    const isMobile = window.innerWidth < 768 ? true : false;

    return { width: innerScreenWidth, height: innerScreenHeight, isMobile };
  }

  // Get Quote Authors Names
  getUserName(user: any, type: string): string {
    if (type === "full") return user.firstName + " " + user.lastName;
    else
      return user.firstName.split(" ")[0] + " " + user.lastName.split(" ")[0];
  }

  // Go Stepper Back
  goStepperBack(stepperReference: any) {
    stepperReference.previous();
  }

  // Go Stepper Forward
  goStepperForward(stepperReference: any) {
    stepperReference.next();
  }

  // Create Angular Editor Insert Image Button
  insertImageButton(
    editor: any,
    cloudinaryService: CloudinaryService
  ): HTMLElement {
    /* =====================================================================
       |                            ELEMENTS CREATION                       |
       =====================================================================
    */

    // Create Main Container
    const insertImageContainer: HTMLElement = document.createElement("span");
    // Add Class To Container
    insertImageContainer.classList.add("ck-file-dialog-button");

    // Create Button
    const insertImageButton: HTMLElement = document.createElement("button");
    // Add Classes To Button
    insertImageButton.classList.add("ck", "ck-button", "ck-off");
    // Set Attibutes To Button
    this.setElementAttributes(insertImageButton, {
      type: "button",
      tabindex: "-1",
    });
    // Add Button Functionality
    insertImageButton.addEventListener("click", () =>
      document.getElementById("insertPostImage").click()
    );

    // Create Icon
    const insertImageButtonIcon: HTMLElement = document.createElement("i");
    // Add Classes To Icon
    insertImageButtonIcon.classList.add(
      "ck",
      "ck-icon",
      "far",
      "fa-image",
      "ff-fa",
      "fs-20",
      "dfc",
      "jcc"
    );

    // Create Tooltip
    const insertImageButtonTooltip: HTMLElement =
      document.createElement("span");
    const insertImageButtonTooltipInner: HTMLElement =
      document.createElement("span");
    // Add Classes To Tooltip
    insertImageButtonTooltip.classList.add("ck", "ck-tooltip", "ck-tooltip_s");
    insertImageButtonTooltipInner.classList.add("ck", "ck-tooltip__text");
    // Set Tooltip Text
    insertImageButtonTooltipInner.innerHTML = "Insertar imagen";

    // Create Input
    const insertImageInput: HTMLElement = document.createElement("input");
    // Add Classes To Input
    insertImageInput.classList.add("ck-hidden");
    // Set Attibutes To Input
    this.setElementAttributes(insertImageInput, {
      id: "insertPostImage",
      type: "file",
      tabindex: "-1",
      accept: "image/jpeg,image/png,image/gif,image/bmp,image/webp,image/tiff",
      multiple: "true",
    });
    // Add Input Functionality
    insertImageInput.onchange = () =>
      this.renderImageIntoEditor(insertImageInput, editor, cloudinaryService);

    /* =====================================================================
       |                          COMPONENT CREATION                       |
       =====================================================================
    */

    //  Append Inner Tooltip To Tooltip Container
    insertImageButtonTooltip.appendChild(insertImageButtonTooltipInner);

    //  Append Tooltip And Icon To Button Container
    insertImageButton.append(insertImageButtonIcon, insertImageButtonTooltip);

    //  Append Button And Input To Main Container
    insertImageContainer.append(insertImageButton, insertImageInput);

    return insertImageContainer;
  }

  openFileViewModal(path: string, name: string, FilePreviewComponent: any) {
    let dialogRef = this.dialog.open(FilePreviewComponent, {
      data: { path, name },
      autoFocus: false,
      disableClose: true,
      panelClass: "file-view-modal",
    });
  }

  /* Open fullscreen */
  openFullscreen(): Promise<boolean> {
    const elem: any = document.body;

    if (this.getScreenSize().isMobile)
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }

    return new Promise((resolve) => resolve(true));
  }

  // Get Insert Image Button Data
  renderImageIntoEditor(
    input: any,
    editor: any,
    cloudinaryService: CloudinaryService
  ) {
    if (input.files) {
      var filesAmount = input.files.length;
      this.allowCKEditorAttributes(editor);
      for (let i = 0; i < filesAmount; i++) {
        const id = this.generateRandomPass(24);
        // Set Cloudinary Uploader File Type - Image
        cloudinaryService.setFileUploadType("image", "multipleImages", id);

        // Add Image File To Cloudinary Uploader
        cloudinaryService.uploader.addToQueue([input.files[i]]);

        var reader = new FileReader();

        reader.onload = function (event) {
          editor.model.change((writer: any) => {
            const insertPosition =
              editor.model.document.selection.getFirstPosition();
            const imageElement = writer.createElement("image", {
              src: event.target.result,
              "data-ide": id,
            });

            // Insert the image in the current selection location.
            editor.model.insertContent(imageElement, insertPosition);
          });
        };

        reader.readAsDataURL(input.files[i]);
      }
    }
  }

  // Reset Filter Input
  resetFilterInput(input: any): any {
    input.value = "";

    return this.tempCompleteArray;
  }

  sanitizeHtmlContent(html: any): Promise<Node> {
    var HTML = document.createElement("div");
    HTML.innerHTML = html;
    return new Promise((resolve, reject) => resolve(HTML.cloneNode(true)));
  }

  // Set HTML Element Attirbutes
  setElementAttributes(el: HTMLElement, attrs: any) {
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  // Push / Update / Delete Item From Array
  upsertArrayItems(
    arrayList: Array<any>,
    item: any,
    action: string
  ): Array<any> {
    // Validate if Item Exists in the List
    arrayList =
      this.tempCompleteArray.length > 0 ? this.tempCompleteArray : arrayList;

    const i = arrayList.findIndex((_item) => _item._id === item._id);

    if (i > -1)
      if (action !== "delete")
        // If Item Exists in the List And "Action" Is Not "Delete" Then Replace It
        arrayList[i] = item;
      // If Item Exists in the List And "Action" Is "Delete" Then Delete It From The List
      else arrayList.splice(i, 1);
    // If Item Doesn't Exists in the List Push It Into It
    else arrayList.unshift(item);

    // this.setTempCompleteArray(arrayList);

    return arrayList;
  }
}
