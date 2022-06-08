import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Ng7DynamicBreadcrumbModule } from 'ng7-dynamic-breadcrumb';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DeliveryNoteComponent } from './delivery-note.component';
import { DeliveryNoteRoutingModule } from './delivery-note-routing.module';
import { DeliveryNoteDetailsTempComponent } from './delivery-note-details-temp/delivery-note-details-temp.component';
import { DeliveryNoteListComponent } from './delivery-note-list/delivery-note-list.component';
import { DeliveryNoteDetailsComponent } from './delivery-note-details/delivery-note-details.component';
import { DeliveryNoteDetailsEditComponent } from './delivery-note-details-edit/delivery-note-details-edit.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    DeliveryNoteRoutingModule,
    MaterialModule,
    FormsModule,
    NgSelectModule,
    FlexLayoutModule,
    Ng7DynamicBreadcrumbModule,
    NgxSpinnerModule,
    TranslateModule
  ],
    entryComponents:[DeliveryNoteDetailsTempComponent,DeliveryNoteDetailsComponent,DeliveryNoteDetailsEditComponent],
    declarations: [DeliveryNoteComponent, DeliveryNoteListComponent, DeliveryNoteDetailsTempComponent, DeliveryNoteDetailsComponent, DeliveryNoteDetailsEditComponent],
    exports: [DeliveryNoteComponent]
})
export class DeliveryNoteModule { }
