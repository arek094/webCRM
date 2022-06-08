import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-technical-break-policy',
  templateUrl: './technical-break-policy.component.html',
  styleUrls: ['./technical-break-policy.component.scss']
})
export class TechnicalBreakPolicyComponent implements OnInit {

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit() {
  }



}
