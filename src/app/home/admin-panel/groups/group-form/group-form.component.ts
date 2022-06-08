import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserGroup } from 'src/app/model/user-group';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  @Input() editMode = false;
  formGroups:FormGroup
  
  constructor(
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm()
  }

  ngAfterViewInit(){
    this.buildForm()
  }

  setGroup(userGroup: UserGroup){
    this.formGroups.patchValue(userGroup)
  }

  buildForm(){
    this.formGroups=this.formBuilder.group({
      grupa_nazwa: new FormControl('',[Validators.required,Validators.minLength(5)]),
    })}


}
