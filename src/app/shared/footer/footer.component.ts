import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { PracticeArea } from "../../models/PracticeArea";
import { Router } from "@angular/router";
import { PracticeAreasService } from "../../services/practice-areas.service";
import { UtilitiesService } from "../../services/utilities.service";
import { TawkService } from "../../services/tawk.service";
import { Contact } from "../../models/Contact";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { ContactService } from "../../services/contact.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent implements OnInit {
  constructor(
    private _contactS: ContactService,
    public _practiceAreaS: PracticeAreasService,
    public TawkService: TawkService,
    public _utilitiesS: UtilitiesService,
    private router: Router
  ) {}

  subscriptionsArray: Subscription[] = [];

  newsLetterForm: FormGroup;
  practiceAreasList: Array<PracticeArea> = [];

  ngOnInit() {
    // Init NewsLetter Form
    this.initNewsLetterForm();

    // Get Practice Areas Supcription
    this.subscriptionsArray.push(
      this._practiceAreaS.getPracticeAreas("APPROVED").subscribe()
    );

    // List Practice Areas Subscription
    this.subscriptionsArray.push(
      this._practiceAreaS
        .getPracticeAreasList()
        .subscribe(([practiceAreasList, action]) => {
          practiceAreasList.map(
            (practiceArea) =>
              (this.practiceAreasList = this._utilitiesS.upsertArrayItems(
                this.practiceAreasList,
                practiceArea,
                action
              ))
          );
        })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Go to Area Detail Section
  goToAreaDetail(id: string): void {
    this._practiceAreaS.goToAreaDetail(this.router, id, this.practiceAreasList);
  }

  private initNewsLetterForm() {
    this.newsLetterForm = new FormGroup({
      emailContact: new FormControl(null, Validators.required),
    });
  }

  // Scroll to Top Function
  scrollToTop() {
    window.scrollTo(0, 0);
  }

  suscribeToNewsLetter() {
    const email = new Contact(
      null,
      this.newsLetterForm.value.emailContact,
      null,
      "Fernando Romo Rodríguez",
      null
    );

    this.subscriptionsArray.push(
      this._contactS.enviarEmail(email, "newsLetter").subscribe(() => {
        this.newsLetterForm.reset();
      })
    );
  }
}
