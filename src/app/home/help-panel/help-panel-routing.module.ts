import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpPanelComponent } from './help-panel.component';
import { AuthGuard } from 'src/app/auth/auth.guard';


const routes: Routes = [
  {path: '', component: HelpPanelComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HelpPanelRoutingModule { }
