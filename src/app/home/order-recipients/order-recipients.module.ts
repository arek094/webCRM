import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingRecipientsModule } from './order-routing-recipients.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { CoreModule, FlexLayoutModule } from '@angular/flex-layout';
import { OrderRecipientsComponent } from './order-recipients.component';
import { RecipientsListComponent } from './recipients-list/recipients-list.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingRecipientsModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    CoreModule,
    TranslateModule
  ],
  declarations:[OrderRecipientsComponent,RecipientsListComponent],
  exports: [OrderRecipientsComponent]
})
export class OrderRecipientsModule { }
