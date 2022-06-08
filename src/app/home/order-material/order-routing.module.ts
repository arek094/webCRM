import { NgModule } from '@angular/core';
import { OrderComponent } from './order.component';
import { Routes, RouterModule } from '@angular/router';
import { NewOrderComponent } from './new-order/new-order.component';
import { AuthGuard } from '../../auth/auth.guard';
import { EditOrderComponent } from './edit-order/edit-order.component';

const routes: Routes = [
  {path: '', component: OrderComponent},
  {path: 'new', component: NewOrderComponent, canActivate: [AuthGuard],data: { title: 'Nowe zamówienie',breadcrumb:[{label:'Strona główna',url:'/dashboard'},{label:'Zamówienie odbiorców', url:'/order-material'},{label:'Nowe zamówienie', url:''}]}},
  {path: ':zam_nag_dost_id', component: EditOrderComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrderRoutingModule { }
