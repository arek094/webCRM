import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSettingsComponent } from './account-settings.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    AccountSettingsRoutingModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    NgSelectModule,
    NgxSpinnerModule
  ],
  declarations:[AccountSettingsComponent],
  exports:[AccountSettingsComponent]
})
export class AccountSettingsModule { }
