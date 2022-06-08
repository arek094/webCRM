import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-data-processing',
  templateUrl: './personal-data-processing.component.html',
  styleUrls: ['./personal-data-processing.component.scss']
})
export class PersonalDataProcessingComponent implements OnInit {

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit() {
  }

}
