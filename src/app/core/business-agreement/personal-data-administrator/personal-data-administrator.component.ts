import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-data-administrator',
  templateUrl: './personal-data-administrator.component.html',
  styleUrls: ['./personal-data-administrator.component.scss']
})
export class PersonalDataAdministratorComponent implements OnInit {

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit() {
  }

}
