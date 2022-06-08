import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, ViewChild, Input } from '@angular/core';
import {Chart} from 'chart.js'
import { MatTabChangeEvent, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService } from 'src/app/service/dashboard.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})



export class DashboardComponent  {

@ViewChildren('pr_chart', { read: ElementRef }) chartElementRefs: QueryList<ElementRef>;
charts: Chart[] = [];  
chartDate: any = []

  constructor(
    public translate: TranslateService,
    public dashboardService: DashboardService,
    private elementRef: ElementRef
  ) {  }

  ngOnInit() {
  }

  private onSuccessList(res) {
  }

  private onFailureList(error) {
    console.log("Failure")
  }

  ngAfterViewInit() {
    this.dashboardService.getCharts().subscribe(res => {
      this.charts = this.chartElementRefs.map((chartElementRef, index) => {
        this.chartDate = res['data'][index]['chart_data']
        const config = Object.assign({}, res['data'][index]['chart_data']);       
        return new Chart(chartElementRef.nativeElement,config);
      });
    },this.onFailureList.bind(this))
  }


}


