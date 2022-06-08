import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { OrderSupplierComponent } from './order-supplier.component';
import { OrderSupplierRoutingModule } from './order-supplier-routing.module';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CoreModule } from 'src/app/core/core.module';
import { GenerateDeliveryNoteComponent } from './generate-delivery-note/generate-delivery-note.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    OrderSupplierRoutingModule,
    FlexLayoutModule,
    CoreModule,
    FormsModule
  ],
  entryComponents:[SupplierDetailsComponent,GenerateDeliveryNoteComponent],
  declarations: [OrderSupplierComponent, SupplierDetailsComponent, SupplierListComponent, GenerateDeliveryNoteComponent],
  exports:[OrderSupplierComponent]
})
export class OrderSupplierModule { }
