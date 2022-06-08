import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminPanelComponent } from './admin-panel.component';
import { UsersComponent } from './users/users.component';
import { UserFormDialogComponent } from './users/user-form-dialog/user-form-dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GroupsComponent } from './groups/groups.component';
import { GroupPermissionComponent } from './groups/group-permission/group-permission.component';
import { GroupFormComponent } from './groups/group-form/group-form.component';
import { NewGroupComponent } from './groups/new-group/new-group.component';
import { EditGroupComponent } from './groups/edit-group/edit-group.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    NgSelectModule,
    NgxSpinnerModule
  ],
  entryComponents:[UserFormDialogComponent,GroupPermissionComponent,NewGroupComponent,EditGroupComponent,NewUserComponent,EditUserComponent],
  declarations:[AdminPanelComponent, UsersComponent, UserFormDialogComponent, GroupsComponent, GroupPermissionComponent, GroupFormComponent, NewGroupComponent, EditGroupComponent, EditUserComponent, NewUserComponent],
  exports: [AdminPanelComponent]
})
export class AdminPanelModule { }
