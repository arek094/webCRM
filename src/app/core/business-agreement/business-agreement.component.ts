import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, ContentChildren, Output,EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterLinkActive } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-business-agreement',
  templateUrl: './business-agreement.component.html',
  styleUrls: ['./business-agreement.component.scss']
})
export class BusinessAgreementComponent implements AfterViewInit, OnInit {

  isViewInitialized = false;
  navLinks = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    public translate: TranslateService,
  ) {}
   

  ngOnInit() {
    this.navLinks = (
      this.route.routeConfig && this.route.routeConfig.children ?
      this.buildNavItems(this.route.routeConfig.children) :
      []
    );
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.changeDetector.detectChanges();
  }


  buildNavItems(routes: Routes) {
    return (routes)
      .filter(route => route.data)
      .map(({ path = '', data }) => ({
        path: path,
        label: data.label,
        icon: data.icon
      }));
  }

  isLinkActive(rla: RouterLinkActive): boolean {
    const routerLink = rla.linksWithHrefs.first;
    
    return this.router.isActive(routerLink.urlTree, false);
  }

}
