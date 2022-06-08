import { NgModule } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE, MatGridListModule, MatListModule, MatProgressSpinnerModule, MatTabsModule, MatSlideToggleModule, MatTooltipModule, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTreeModule, MatExpansionModule } from '@angular/material';
import { MomentUtcDateAdapter } from '../shared/moment-utc-date-adapter';

import {
  MAT_DIALOG_DEFAULT_OPTIONS, MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule, MatDialogConfig,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule, MatSnackBarConfig,
  MatSnackBarModule,
  MatToolbarModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatTableModule,
  MatPaginatorModule,
  MatAutocompleteModule,
  MatSidenavModule,
  MatMenuModule,
  MatSortModule
  


} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatetimepickerModule, MatDatetimeFormats, MAT_DATETIME_FORMATS, DatetimeAdapter } from '@mat-datetimepicker/core';
import {  MatMomentDatetimeModule, MomentDatetimeAdapter } from "@mat-datetimepicker/moment";

const MAT_SNACK_BAR_GLOBAL_CONFIG: MatSnackBarConfig = {
  duration: 2500,
  verticalPosition: 'bottom',
  horizontalPosition: 'center'
};

const MAT_DIALOG_GLOBAL_CONFIG: MatDialogConfig = {
  maxHeight:'700px',
  disableClose: true,
  hasBackdrop: true
};

const MAT_TOOLTIP_GLOBAL_CONFIG: MatTooltipModule = {
  TooltipPosition : 'above'
}

const MAT_MOMENT_DATETIME_FORMATS: MatDatetimeFormats = {
  parse: {
    dateInput: "L",
    monthInput: "MMMM",
    timeInput: "LT",
    datetimeInput: "L LT"
  },
  display: {
    dateInput: "L",
    monthInput: "MMMM",
    datetimeInput: "L LT",
    timeInput: "LT",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
    popupHeaderDateLabel: "ddd, DD MMM"
  }
};

const MATERIAL_MODULES = [
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatSelectModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatPaginatorModule,
  ReactiveFormsModule,
  MatAutocompleteModule,
  MatSidenavModule,
  MatMenuModule,
  MatSortModule,
  MatGridListModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatMomentDatetimeModule,
  MatDatetimepickerModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatTreeModule,
  MatExpansionModule
  
];

@NgModule({
  exports: [...MATERIAL_MODULES],
  declarations: [],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: MAT_DIALOG_GLOBAL_CONFIG},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: MAT_SNACK_BAR_GLOBAL_CONFIG},
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue:MAT_TOOLTIP_GLOBAL_CONFIG},
    { provide: MAT_DATE_LOCALE, useValue: 'pl' },
    { provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    //{ provide: DateAdapter, useClass: MomentUtcDateAdapter },
    
  ]
})
export class MaterialModule {}
