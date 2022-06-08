import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationRoutingModule } from './notification-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NotificationComponent } from './notification.component';
import { NotificationFormComponent } from './notification-form/notification-form.component';
import { NotificationNewComponent } from './notification-new/notification-new.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    NotificationRoutingModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    NgxSpinnerModule
  ],
  entryComponents:[NotificationNewComponent],
  declarations:[NotificationComponent, NotificationFormComponent, NotificationNewComponent],
  exports: [NotificationComponent]
})
export class NotificationModule { }
