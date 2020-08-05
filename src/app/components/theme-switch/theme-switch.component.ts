import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.css']
})
export class ThemeSwitchComponent implements OnInit {

  constructor(public _themeS: ThemeService) {
    this._themeS.checkStorage();

    this._themeS.checkChanges();
  }

  ngOnInit() {}

  // Change Theme Function
  changeTheme() {
    this._themeS.darkTheme.setValue(this._themeS.val);
    this._themeS.checkStorage();
    console.log(this._themeS.darkTheme);
  }

  switch() {
    this._themeS.switchVal()
  }

}
