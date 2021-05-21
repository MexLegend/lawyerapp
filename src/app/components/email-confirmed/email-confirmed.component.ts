import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UtilitiesService } from "../../services/utilities.service";
import { ContactService } from "../../services/contact.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Contact } from "../../models/Contact";
import { ComponentData } from "../../models/ComponentData";
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
          this.tokenData = resp.responseData;
          this.getResponseData(
            this.getActionType(this.router.url),
            resp.responseData
          );
        } else if (!resp.ok && !resp.tokenExpired) {
          this.setComponentData(
            new ComponentData(
              "Error inesperado",
              `Se produjo un error y tu solicitud no fue procesada. Por favor intentalo de nuevo.`,
              "Reintentar",
              () => this.getResponseData(this.getActionType(this.router.url)),
              false,
              "",
              null,
              false,
              "",
              false,
              false
            )
          );
        } else
          this.getResponseData(
            this.getActionType("token-not-valid"),
            resp.responseData
          );
      });
    } else {
      this.getResponseData(this.getActionType(this.router.url));
    }
  }

  serverAlert: serverAlert = { show: false, type: "", message: "" };

  recoverForm: FormGroup;
  responseData: any = null;
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

  getActionType(url: string): string {
    const actionType = () => {
      if (url.includes("newsletter")) return "newsletter";
      else if (
        url.includes("account") &&
        !url.includes("account-recovery") &&
        !url.includes("change-pass")
      )
        return "account";
      else if (url.includes("account-recovery")) return "account-recovery";
      else if (url.includes("change-pass")) return "change-pass";
      else if (url.includes("token-not-valid")) return "token-not-valid";
      else return "newsletter-unsubscription";
    };

    return actionType();
  }

  getEmailSubject(action: string): string {
    const subject = () => {
      if (action === "confirmNewsLetter")
        return "Confirmar suscripción del boletín informativo de Haizen";
      else if (action === "recoverAccount")
        return "Cambiar contraseña de tu cuenta de Haizen";
      else return "Verificar cuenta de Haizen";
    };

    return subject();
  }

  getResponseData(action: string, respData?: any) {
    switch (action) {
      case "newsletter":
        this.setComponentData(
          new ComponentData(
            "Gracias por suscribirte al boletín de Haizen Abogados",
            "Desde ahora recibiras notificaciones de noticias, contenido exclusivo, ofertas y mucho más.",
            "Volver a Haizen Abogados",
            () => this.router.navigate([`/inicio`]),
            false,
            "",
            null,
            false,
            "",
            false,
            false
          )
        );
        break;
      case "account":
        this.setComponentData(
          new ComponentData(
            "Cuenta verificada",
            `<b>Hola, ${
              respData.firstName + " " + respData.lastName
            }</b></br></br> Tu correo ha sido verificado y tu cuenta ahora está activa. Usa el botón inferior para iniciar sesión en tu cuenta.`,
            "Iniciar sesión",
            () => {
              this.router.navigate([`/inicio`]);
              this._utilitiesS.openLoginModal(0);
            },
            false,
            "",
            null,
            false,
            "",
            true,
            false
          )
        );
        break;
      case "account-recovery":
        this.initRecoverForm("email");
        this.setComponentData(
          new ComponentData(
            "Restablecer contraseña",
            "Para obtener un enlace de restablecimiento de contraseña ingresa a continuación tu correo electronico.",
            "Enviar enlace",
            null,
            false,
            "",
            null,
            true,
            "email",
            false,
            false
          )
        );
        break;
      case "change-pass":
        this.initRecoverForm("password");
        this.setComponentData(
          new ComponentData(
            "Elije una nueva contraseña",
            "Una contraseña segura contribuye a evitar el acceso no autorizado a tu cuenta de Haizen.",
            "Continuar",
            null,
            true,
            "Omitir",
            () => this.router.navigate([`/inicio`]),
            true,
            "password",
            false,
            false
          )
        );
        break;
      case "token-not-valid":
        this.setComponentData(
          new ComponentData(
            "El token ha expirado",
            "Reenviar petición y generar un nuevo token.",
            "Continuar",
            () => this.resendToken(respData),
            true,
            "Omitir",
            () => this.router.navigate([`/inicio`]),
            false,
            "",
            false,
            false
          )
        );
        break;
      default:
        this.setComponentData(
          new ComponentData(
            "Tu solicitud se ha completado correctamente",
            "Lamentamos que ya no desees estar con nosotros",
            "Volver a Haizen Abogados",
            () => this.router.navigate([`/inicio`]),
            false,
            "",
            null,
            false,
            "",
            false,
            false
          )
        );
        break;
    }
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

  resendToken(data: any) {
    const email = new Contact(
      data.firstName ? data.firstName + " " + data.lastName : "",
      data.email,
      null,
      null,
      this.getEmailSubject(data.action),
      "",
      null,
      data._id
    );
    const emailSub = this._contactS
      .enviarEmail(email, data.action, null, true)
      .subscribe(() => {
        this.setComponentData(
          new ComponentData(
            "Comprueba tu buzón de correo electrónico",
            `Se ha enviado un nuevo mensaje al correo <b>${data.email}</b>.</br></br> Puede que tarde unos minutos en aparecer, 
            pero revisa las carpetas de spam y correos promocionales por si acaso.`,
            "Hecho",
            () => this.router.navigate([`/inicio`]),
            false,
            "",
            null,
            false,
            "",
            false,
            false
          )
        );
        emailSub.unsubscribe();
      });
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
            this.setComponentData(
              new ComponentData(
                "Tu contraseña ha sido restablecida",
                "Usa el botón inferior para iniciar sesión en tu cuenta.",
                "Iniciar sesión",
                () => {
                  this.router.navigate([`/inicio`]);
                  this._utilitiesS.openLoginModal(0);
                },
                false,
                "",
                null,
                false,
                "",
                true,
                false
              )
            );
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
              this.setComponentData(
                new ComponentData(
                  "Comprueba tu buzón de correo electrónico",
                  `Ve a tu correo <b>${formData.value.email}</b> y haz clic en el enlace de restablecimiento 
                  de contraseña que te hemos enviado para tu cuenta de Haizen.</br></br> Puede que tarde unos minutos en aparecer, 
                  pero revisa las carpetas de spam y correos promocionales por si acaso.`,
                  "Hecho",
                  () => this.router.navigate([`/inicio`]),
                  true,
                  "Comenzar de nuevo",
                  () => this.getResponseData("account-recovery"),
                  false,
                  "",
                  false,
                  true
                )
              );

              this.recoverForm.reset();
              emailSub.unsubscribe();
            });
          validateEmailSub.unsubscribe();
        } else this.setServerAlertData("notExist");
      });
  }

  setComponentData(componentData: ComponentData) {
    this.responseData = componentData;
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
