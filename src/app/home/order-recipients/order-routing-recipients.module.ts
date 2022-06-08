import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderRecipientsComponent } from './order-recipients.component';

const routes: Routes = [
  {path: '', component: OrderRecipientsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrderRoutingRecipientsModule { }
