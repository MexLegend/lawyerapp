import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UtilitiesService } from "../../services/utilities.service";
import { ContactService } from "../../services/contact.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Contact } from "../../models/Contact";
import { UsersService } from "../../services/users.service";

interface serverAlert {
  show: boolean;
  type: string;
  message: string;
}

@Component({
  selector: "app-email-confirmed",
  templateUrl: "./email-confirmed.component.html",
  styleUrls: ["./email-confirmed.component.css"],
})
export class EmailConfirmedComponent implements OnInit {
  constructor(
    private _contactS: ContactService,
    private router: Router,
    private _usersS: UsersService,
    public _utilitiesS: UtilitiesService
  ) {
    // Check If Route Has A Token
    if (this.router.url.includes("token=")) {
      var token = this.router.url.substr(this.router.url.indexOf("token=") + 6);
      this._utilitiesS.checkToken(token).subscribe((resp) => {
        if (resp.ok) {
          this.tokenData = resp.decoded;
          this.getResponseData(this.router.url);
        } else this.getResponseData("token-not-valid");
      });
    } else {
      this.getResponseData(this.router.url);
    }
  }

  serverAlert: serverAlert = { show: false, type: "", message: "" };

  recoverForm: FormGroup;
  responseData: any = {};
  tokenData: any;

  ngOnInit(): void {
    document.getElementsByTagName("html")[0].classList.add("hide-scroll");
    document.querySelector("body").classList.add("hide-scroll");
  }

  ngOnDestroy(): void {
    document.getElementsByTagName("html")[0].classList.remove("hide-scroll");
    document.querySelector("body").classList.remove("hide-scroll");
  }

  notEqual(values: Object): boolean {
    if (values["password"] !== values["confirmPassword"]) return true;
    else return false;
  }

  getResponseData(url: string) {
    const data = () => {
      if (url.includes("newsletter"))
        return {
          title: "Gracias por suscribirte al boletín de Haizen Abogados",
          subtitle:
            "Desde ahora recibiras notificaciones de noticias, contenido exclusivo, ofertas y mucho más.",
          buttonPrimaryText: "Volver a Haizen Abogados",
          buttonPrimaryAction: () => this.router.navigate([`/inicio`]),
          buttonSecondary: false,
          form: false,
          formInputs: "",
          login: false,
          sended: false,
        };
      else if (
        url.includes("account") &&
        !url.includes("account-recovery") &&
        !url.includes("change-pass")
      )
        return {
          title: "Cuenta verificada",
          subtitle:
            "<b>Hola Armando Lara</b></br></br> Tu correo ha sido verificado y tu cuenta ahora está activa. Usa el botón inferior para iniciar sesión en tu cuenta.",
          buttonPrimaryText: "Iniciar sesión",
          buttonPrimaryAction: () => {
            this.router.navigate([`/inicio`]);
            this._utilitiesS.openLoginModal(0);
          },
          buttonSecondary: false,
          form: false,
          formInputs: "",
          login: true,
          sended: false,
        };
      else if (url.includes("account-recovery")) {
        this.initRecoverForm("email");
        return {
          title: "Restablecer contraseña",
          subtitle:
            "Para obtener un enlace de restablecimiento de contraseña ingresa a continuación tu correo electronico.",
          buttonPrimaryText: "Enviar enlace",
          buttonPrimaryAction: () => {},
          buttonSecondary: false,
          form: true,
          formInputs: "email",
          login: false,
          sended: false,
        };
      } else if (url.includes("change-pass")) {
        this.initRecoverForm("password");
        return {
          title: "Elije una nueva contraseña",
          subtitle:
            "Una contraseña segura contribuye a evitar el acceso no autorizado a tu cuenta de Haizen.",
          buttonPrimaryText: "Continuar",
          buttonPrimaryAction: () => {},
          buttonSecondary: true,
          buttonSecondaryText: "Omitir",
          buttonSecondaryAction: () => this.router.navigate([`/inicio`]),
          form: true,
          formInputs: "password",
          login: false,
          sended: false,
        };
      } else if (url.includes("token-not-valid")) {
        return {
          title: "El token ha expirado",
          subtitle: "Reenviar petición y generar un nuevo token.",
          buttonPrimaryText: "Continuar",
          buttonPrimaryAction: () => {},
          buttonSecondary: true,
          buttonSecondaryText: "Omitir",
          buttonSecondaryAction: () => this.router.navigate([`/inicio`]),
          form: false,
          formInputs: "",
          login: false,
          sended: false,
        };
      } else
        return {
          title: "Tu solicitud se ha completado correctamente",
          subtitle: "Lamentamos que ya no desees estar con nosotros",
          buttonPrimaryText: "Volver a Haizen Abogados",
          buttonPrimaryAction: () => this.router.navigate([`/inicio`]),
          buttonSecondary: false,
          form: false,
          formInputs: "",
          login: false,
          sended: false,
        };
    };

    this.responseData = data();
  }

  private initRecoverForm(formInputs: string) {
    this.recoverForm = new FormGroup({
      email: new FormControl(
        null,
        formInputs === "email" ? Validators.required : null
      ),
      password: new FormControl(null, Validators.minLength(9)),
      confirmPassword: new FormControl(
        null,
        formInputs === "password" ? Validators.required : null
      ),
    });

    if (formInputs === "password")
      this.recoverForm.controls["password"].setValidators([
        Validators.required,
      ]);
  }

  // Reset Password
  resetPassword() {
    if (this.notEqual(this.recoverForm.value))
      this.setServerAlertData("passwordMissMatch");
    else {
      this.setServerAlertData("reset");
      this._usersS
        .updatePasswordDirectly(this.tokenData.id, this.recoverForm.value)
        .subscribe((resp) => {
          this.recoverForm.reset();
          if (resp.ok) {
            this.responseData = {
              title: "Tu contraseña ha sido restablecida",
              subtitle:
                "Usa el botón inferior para iniciar sesión en tu cuenta.",
              buttonPrimaryText: "Iniciar sesión",
              buttonPrimaryAction: () => {
                this.router.navigate([`/inicio`]);
                this._utilitiesS.openLoginModal(0);
              },
              buttonSecondary: false,
              buttonSecondaryText: "",
              buttonSecondaryAction: "",
              form: false,
              formInputs: "",
              login: true,
              sended: false,
            };
          } else
            this.setServerAlertData(
              "server-error",
              "Error al actualizar la contraseña."
            );
        });
    }
  }

  // Send Email
  sendEmail(formData: any) {
    const validateEmailSub = this._usersS
      .validateEmailsExists(formData.value.email)
      .subscribe((resp) => {
        if (resp.ok) {
          const email = new Contact(
            resp.user.firstName + " " + resp.user.lastName,
            formData.value.email,
            null,
            null,
            "Cambiar contraseña de tu cuenta de Haizen",
            "",
            null,
            resp.user._id
          );
          this.setServerAlertData("reset");
          const emailSub = this._contactS
            .enviarEmail(email, "recoverAccount")
            .subscribe(() => {
              this.responseData = {
                title: "Comprueba tu buzón de correo electrónico",
                subtitle: `Ve a tu correo <b>${formData.value.email}</b> y haz clic en el enlace de restablecimiento 
            de contraseña que te hemos enviado para tu cuenta de Haizen.</br></br> Puede que tarde unos minutos en aparecer, 
            pero revisa las carpetas de spam y correos promocionales por si acaso.`,
                buttonPrimaryText: "Hecho",
                buttonPrimaryAction: () => this.router.navigate([`/inicio`]),
                buttonSecondary: true,
                buttonSecondaryText: "Comenzar de nuevo",
                buttonSecondaryAction: () =>
                  this.getResponseData("account-recovery"),
                form: false,
                formInputs: "",
                login: false,
                sended: true,
              };
              this.recoverForm.reset();
              emailSub.unsubscribe();
            });
          validateEmailSub.unsubscribe();
        } else this.setServerAlertData("notExist");
      });
  }

  setServerAlertData(type: string, message?: string) {
    switch (type) {
      case "notExist":
        this.serverAlert = {
          show: true,
          type: "notExist",
          message: "Este correo no está registrado.",
        };
        break;
      case "passwordMissMatch":
        this.serverAlert = {
          show: true,
          type: "passwordMissMatch",
          message: "Las contraseñas no coinciden.",
        };
        break;
      case "server-error":
        this.serverAlert = {
          show: true,
          type: "server-error",
          message: message,
        };
        break;
      case "verify":
        this.serverAlert = {
          show: true,
          type: "verify",
          message: "Este correo no está verificado.",
        };
        break;
      default:
        this.serverAlert = {
          show: false,
          type: "",
          message: "",
        };
        break;
    }
  }
}
