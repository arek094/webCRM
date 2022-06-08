import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { BusinessAgreementComponent } from './business-agreement.component';
import { PersonalDataAdministratorComponent } from './personal-data-administrator/personal-data-administrator.component';
import { PersonalDataProcessingComponent } from './personal-data-processing/personal-data-processing.component';
import { TechnicalBreakPolicyComponent } from './technical-break-policy/technical-break-policy.component';

let routes: Routes = [
    {path: '', component: BusinessAgreementComponent, children: [
        { path: 'cookie-policy', component: CookiePolicyComponent, data: { label: 'Polityka cookie' }},
        { path: 'personal-data-administrator', component: PersonalDataAdministratorComponent, data: { label: 'Administrator danych osobowych i partnerów obsługujących' }},
        { path: 'personal-data-processing', component: PersonalDataProcessingComponent, data: { label: 'Proces przetwarzania danych osobowych' }},
        { path: 'privacy-policy', component: PrivacyPolicyComponent, data: { label: 'Polityka prywatności' }},
        { path: 'technical-break-policy', component: TechnicalBreakPolicyComponent, data: { label: 'Polityka przerw technicznych i dostępności platformy' }}
      ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BusinessAgreementRoutingModule {}
