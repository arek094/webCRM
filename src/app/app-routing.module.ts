import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './core/register/register.component';
import { ForgotPasswordComponent } from './core/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';
import { VerifyEmailComponent } from './core/verify-email/verify-email.component';
import { BusinessAgreementComponent } from './core/business-agreement/business-agreement.component';
import { TranslateModule } from '@ngx-translate/core';

let routes: Routes = [
  {path: '', redirectTo: '/login',pathMatch:'full',},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password/:uzytkownik_id/:token', component: ResetPasswordComponent},
  {path: 'verify-email/:uzytkownik_id/:token',  component: VerifyEmailComponent},
  {path: 'business-agreement',  loadChildren: './core/business-agreement/business-agreement.module#BusinessAgreementModule' },
  {path: 'home',loadChildren: './home/home.module#HomeModule' ,canActivate: [AuthGuard]}
  //{path: 'home',loadChildren: './home/home.module#HomeModule' ,canActivate: [AuthGuard], data:{roles:16}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})

export class AppRoutingModule {}
