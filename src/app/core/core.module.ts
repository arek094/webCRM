import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { TimerComponent } from './timer/timer.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { MatDialogModule, MatDatepickerModule } from '@angular/material';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {Ng7DynamicBreadcrumbModule} from "ng7-dynamic-breadcrumb";
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { HelpMessageComponent } from './help-message/help-message.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {TranslateModule} from '@ngx-translate/core';
import { ChangeLanguageComponent } from './change-language/change-language.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RegulationsComponent } from './regulations/regulations.component';
import { SupplierComponent } from './regulations/supplier/supplier.component';
import { RecipientComponent } from './regulations/recipient/recipient.component';
import { PersonalDataComponent } from './regulations/personal-data/personal-data.component';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    MatDialogModule,
    FlexLayoutModule,
    Ng7DynamicBreadcrumbModule,
    TranslateModule,
    NgSelectModule,
    NgxSpinnerModule,
    PdfViewerModule,
    RecaptchaModule,
    RecaptchaFormsModule 
  ],
  entryComponents:[DialogConfirmComponent,SnackBarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [LoginComponent, TimerComponent,DialogConfirmComponent, RegisterComponent, ForgotPasswordComponent, ResetPasswordComponent, SnackBarComponent, HelpMessageComponent, ChangePasswordComponent, ChangeLanguageComponent, VerifyEmailComponent, ToolbarComponent, RegulationsComponent, SupplierComponent, RecipientComponent, PersonalDataComponent],
  exports: [TimerComponent,DialogConfirmComponent,NgxSpinnerModule,ToolbarComponent,ChangeLanguageComponent,TranslateModule,PdfViewerModule],
  providers: [{
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: '6Lf2JOIUAAAAAPu3f74iGqWDpumY1rBLM45x9KYs',
    } as RecaptchaSettings,
  }]
})
export class CoreModule {}
