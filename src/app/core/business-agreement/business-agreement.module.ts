import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessAgreementRoutingModule } from './business-agreement-routing.module';
import { BusinessAgreementComponent } from './business-agreement.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CoreModule } from '../core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { TechnicalBreakPolicyComponent } from './technical-break-policy/technical-break-policy.component';
import { PersonalDataProcessingComponent } from './personal-data-processing/personal-data-processing.component';
import { PersonalDataAdministratorComponent } from './personal-data-administrator/personal-data-administrator.component';



@NgModule({
  imports: [
    CommonModule,
    BusinessAgreementRoutingModule,
    CoreModule,
    MaterialModule,
  ],
  providers:[],
  entryComponents:[],
  declarations: [BusinessAgreementComponent,CookiePolicyComponent,PrivacyPolicyComponent, TechnicalBreakPolicyComponent, PersonalDataProcessingComponent, PersonalDataAdministratorComponent]
})

export class BusinessAgreementModule { }
