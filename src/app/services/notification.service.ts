import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient
  ) { }

  mensaje(icon, title, text, showCancelButton: boolean, showConfirmButton: boolean = true, confirmButtonText: string = '', cancelButtonText: string = '', timer) {   

    Swal.fire({
        icon,
        title,
        text,
        showCancelButton,
        showConfirmButton,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText,
        cancelButtonText,
        timer
      })
  }
}
