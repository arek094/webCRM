import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from './model/user';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';



  constructor(translate: TranslateService) {
    translate.setDefaultLang('pl');
  }


}
