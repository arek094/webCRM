import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountSettingsComponent } from './account-settings.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  {path: ':uzytkownik_id', component: AccountSettingsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AccountSettingsRoutingModule {}
