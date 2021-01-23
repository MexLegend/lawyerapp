import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { UsersService } from "../services/users.service";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private _usersS: UsersService) {}

  canActivate() {
    if (
      this._usersS.user.role === "ADMIN" ||
      this._usersS.user.role === "ASSOCIATED"
    ) {
      return true;
    } else {
      this.router.navigate(["/inicio"]);
      return false;
    }
  }
}
