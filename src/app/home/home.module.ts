import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HeaderComponent } from './component/header/header.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbComponent } from './component/breadcrumb/breadcrumb.component';
import { OrderRecipientsComponent } from './order-recipients/order-recipients.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { NewGroupComponent } from './admin-panel/groups/new-group/new-group.component';
import { HelpPanelComponent } from './help-panel/help-panel.component';
import { HelpMessageComponent } from '../core/help-message/help-message.component';
import { ChangePasswordComponent } from '../core/change-password/change-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { HomeResolve } from './home.resolve';
import { ChangeLanguageComponent } from '../core/change-language/change-language.component';
import { RegulationsComponent } from '../core/regulations/regulations.component';
import { NotificationComponent } from './notification/notification.component';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    CoreModule,
    MaterialModule,
    FlexLayoutModule,
    Ng7DynamicBreadcrumbModule,
    
  ],
  providers:[HomeResolve],
  entryComponents:[HelpMessageComponent,ChangePasswordComponent,RegulationsComponent],
  declarations: [HomeComponent, HeaderComponent, SidebarComponent, BreadcrumbComponent]
})
export class HomeModule { }
