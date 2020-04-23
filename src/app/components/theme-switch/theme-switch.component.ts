import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.css']
})
export class ThemeSwitchComponent implements OnInit {

  constructor(
    public _themeS: ThemeService
  ) {
    if ( localStorage.getItem('dark') ) {
      this.check = JSON.parse(localStorage.getItem('dark'))
    }

    this.darkTheme.valueChanges.subscribe(value => {
      console.log(value)
      if (value) {
        this._themeS.toggleDark();
      } else {
        this._themeS.toggleLight();
      }
    });
  }

  darkTheme = new FormControl(false);
  check: any;

  ngOnInit() {
  }

}
