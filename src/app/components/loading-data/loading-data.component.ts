import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  Input,
} from "@angular/core";
import { UtilitiesService } from "../../services/utilities.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-loading-data",
  templateUrl: "./loading-data.component.html",
  styleUrls: ["./loading-data.component.css"],
})
export class LoadingDataComponent implements OnInit {
  loaderComponents: Array<number>;
  offsetHeight: number = 0;
  resizeTimer = undefined;
  subscriptionsArray: Subscription[] = [];

  @Input() loaderContainer: any;
  @Input() loaderType: string;

  constructor(
    public _utilitiesS: UtilitiesService,
    private loaderContainerRef: ElementRef
  ) {}

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.loaderComponents = this._utilitiesS.setLoaderComponentsList(
        this.getComponentsHight(this.loaderType)
      );
    }, 200);
  }

  ngOnInit(): void {
    // this.subscriptionsArray.push(
    //   this._utilitiesS
    //     .getLoaderComponentsList()
    //     .subscribe((componentsList) => (this.loaderComponents = componentsList))
    // );

    const refreshInterval = setInterval(() => {
      if (this.offsetHeight === 0) {
        this.offsetHeight = this.loaderContainer.offsetHeight;
      } else {
        clearInterval(refreshInterval);
        this.loaderComponents = this._utilitiesS.setLoaderComponentsList(
          this.getComponentsHight(this.loaderType)
        );
      }
    }, 10);
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  getComponentsHight(type: string): number {
    const number = () => {
      switch (type) {
        case "common":
          return Math.floor(this.loaderContainer.offsetHeight / 60);
        case "complex":
          return (
            Math.floor(this.loaderContainer.offsetHeight / 200) *
            Math.floor(this.loaderContainer.offsetWidth / 250)
          );
        default:
          return 1;
      }
    };
    return number();
  }
}
