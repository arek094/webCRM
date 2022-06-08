import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPanelRoutingModule } from './help-panel-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HelpPanelComponent } from './help-panel.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HelpMessageComponent } from 'src/app/core/help-message/help-message.component';

@NgModule({
  imports: [
    CommonModule,
    HelpPanelRoutingModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    PdfViewerModule
  ],
  declarations:[HelpPanelComponent],
  exports: [HelpPanelComponent]
})
export class HelpPanelModule { }
