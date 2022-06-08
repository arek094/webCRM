import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderSupplierComponent } from './order-supplier.component';

const routes: Routes = [
  {path: '', component: OrderSupplierComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrderSupplierRoutingModule { }
