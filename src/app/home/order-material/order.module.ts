import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderFormComponent } from './order-form/order-form.component';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';
import { NewOrderComponent } from './new-order/new-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DetailsComponent } from './details/details.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProductComponent } from './product/product.component';
//import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { NgxSpinnerModule } from 'ngx-spinner';




@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    MaterialModule,
    FormsModule,
    NgSelectModule,
    FlexLayoutModule,
    //Ng7DynamicBreadcrumbModule,
    NgxSpinnerModule
    
  ],
  entryComponents:[ProductComponent,DetailsComponent],
  declarations: [OrderComponent, NewOrderComponent,OrderFormComponent, OrderListComponent, DetailsComponent, EditOrderComponent, ProductComponent ],
  exports: [OrderComponent]
})

export class OrderModule { }
