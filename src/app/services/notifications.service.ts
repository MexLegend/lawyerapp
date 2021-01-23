import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  constructor() {}

  message(
    icon,
    title,
    text,
    showCancelButton: boolean,
    showConfirmButton: boolean = true,
    confirmButtonText: string = "",
    cancelButtonText: string = "",
    timer?
  ) {
    Swal.fire({
      icon,
      title,
      text,
      showCancelButton,
      showConfirmButton,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText,
      cancelButtonText,
      timer,
    });
  }

  
}
