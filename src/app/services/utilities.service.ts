import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";

declare var $: any;

@Injectable({
  providedIn: "root",
})
export class UtilitiesService {
  private clientShowMoreIndex = new Subject<any>();
  private showMoreIndex = new Subject<any>();
  private sidenavShowMoreIndex = new Subject<any[]>();

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

  // Scroll to Top of New Page
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
