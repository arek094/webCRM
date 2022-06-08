import { Component, OnInit, ViewChild, OnChanges, DoCheck, AfterViewInit, AfterViewChecked, AfterContentChecked, AfterContentInit } from '@angular/core';
import { AdminPanelService } from 'src/app/service/admin-panel.service';
import { NewGroupComponent } from './groups/new-group/new-group.component';
import { GroupsComponent } from './groups/groups.component';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  

  constructor(
    
  ) { }

  ngOnInit() {
  
  }



}
