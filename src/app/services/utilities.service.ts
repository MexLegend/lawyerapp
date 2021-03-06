import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MatTabGroup } from "@angular/material";
import { LoginComponent } from "../modals/login/login.component";

declare var $: any;

@Injectable({
  providedIn: "root",
})
export class UtilitiesService {
  constructor(public dialog: MatDialog) {}

  private arraysList = new Subject<[Array<any>, string, string]>();
  private clientShowMoreIndex = new Subject<any>();
  private isModalAlertRendered = new Subject<boolean>();
  private showMoreIndex = new Subject<any>();
  private sidenavShowMoreIndex = new Subject<any[]>();
  private tempCompleteArray: Array<any> = [];

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
  ) {
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

  // Generate Random 15 Characters Password
  generateRandomPass(): string {
    return Math.random().toString(36).slice(-15);
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
    event: any
  ) {
    let title: string = null;
    let text: string = null;

    event.stopPropagation();

    switch (action) {
      case "like": {
        title = "¿Te gusta este artículo?";
        text = "Inicia sesión para hacer que tu opinión cuente.";
        break;
      }

      case "comment":
        title = "¿Deseas comentar este artículo?";
        text = "Inicia sesión para compartir tu opinión.";
        break;

      case "contactLawyer":
        title = "¿Deseas contactar al abogado?";
        text = "Inicia sesión para contactarlo directamente.";
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
      panelClass: "modalRegistro",
    });
    dialogRef.componentInstance.selected.setValue(activeModalTab);

    const loginModalOpenedRef = dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance.modalRef = dialogRef;
      document.getElementsByTagName("html")[0].classList.add("hide-scroll");
      document.querySelector("body").classList.add("hide-scroll");
      loginModalOpenedRef.unsubscribe();
    });

    const loginModalClosedRef = dialogRef.afterClosed().subscribe(() => {
      document.getElementsByTagName("html")[0].classList.remove("hide-scroll");
      document.querySelector("body").classList.remove("hide-scroll");
      loginModalClosedRef.unsubscribe();
    });
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

  // Go Stepper Back
  goStepperBack(stepperReference: any) {
    stepperReference.previous();
  }

  // Go Stepper Forward
  goStepperForward(stepperReference: any) {
    stepperReference.next();
  }

  // Reset Filter Input
  resetFilterInput(input: any): any {
    input.value = "";

    return this.tempCompleteArray;
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
