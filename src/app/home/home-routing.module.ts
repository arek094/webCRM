import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { HomeResolve } from './home.resolve';
import { TranslateService } from '@ngx-translate/core';



const routes: Routes = [
    {
        path: '',
        component:HomeComponent,
        resolve: {home: HomeResolve},
        //canActivate: [AuthGuard],
        //data: {roles: 18},
        children: [
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' , canActivate: [AuthGuard], data: { roles: 16, title: 'Panel kontrolny',breadcrumb:[{label:'Strona główna',url:'/dashboard'},{label:'Panel kontrolny', url:''}] }},
            { path: 'order-material', loadChildren: './order-material/order.module#OrderModule' , canActivate: [AuthGuard],data: { roles: 15,  title: 'Zamówienia surowców',breadcrumb:[{label:'Strona główna',url:'/dashboard'},{label:'Zamówienie surowców', url:''}]}},
            { path: 'order-supplier', loadChildren: './order-supplier/order-supplier.module#OrderSupplierModule' , canActivate: [AuthGuard], data: { roles: 17, title: 'Zamówienia dostawców',breadcrumb:[{label:'Strona główna',url:'/dashboard'},{label:'Zamówienie dostawców', url:''}]} },
            { path: 'order-recipients', loadChildren: './order-recipients/order-recipients.module#OrderRecipientsModule' , canActivate: [AuthGuard], data: { roles: 18,  title: 'Zamówienia odbiorców',breadcrumb:[]} },
            //{ path: 'order-recipients', loadChildren: './order-recipients/order-recipients.module#OrderRecipientsModule' , canActivate: [AuthGuard], data: { roles: 18,  title: 'Zamówienia odbiorców',breadcrumb:[{label:'Strona główna',url:'/dashboard'},{label:'Zamówienie odbiorców', url:''}]} },
            { path: 'admin-panel', loadChildren: './admin-panel/admin-panel.module#AdminPanelModule' , canActivate: [AuthGuard], data: { roles: 14,  title: 'Panel administracyjny',breadcrumb:[{label:'Strona główna',url:'/dashboard'},{label:'Panel administracyjny', url:''}]} },
            { path: 'account-settings', loadChildren: './account-settings/account-settings.module#AccountSettingsModule' , canActivate: [AuthGuard], data: { roles: 21,title: 'Ustawienia konta',breadcrumb:[{label:'Strona główna',url:'/dashboard'},{label:'Ustawienia konta', url:''}]} },
            { path: 'help-panel', loadChildren: './help-panel/help-panel.module#HelpPanelModule' , canActivate: [AuthGuard], data: { roles: 20, title: 'Pomoc',breadcrumb:[{label:'Strona główna',url:'/dashboard'},{label:'Pomoc', url:''}]} },
            { path: 'delivery-note', loadChildren: './delivery-note/delivery-note.module#DeliveryNoteModule' , canActivate: [AuthGuard], data: { roles: 25, title: 'Dokument wydania dostawców',breadcrumb:[{label:'Strona główna',url:'/delivery-note'},{label:'Dokument wydania dostawców', url:''}]} },
            { path: 'notification', loadChildren: './notification/notification.module#NotificationModule' , canActivate: [AuthGuard], data: { roles: 28, title: 'Panel zgłoszeń',breadcrumb:[{label:'Strona główna',url:'/notification'},{label:'Panel zgłoszeń', url:''}]} },
         
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { 

    constructor(
        public translate: TranslateService
        ) 
        { 

    
        }

}
