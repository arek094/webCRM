import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})
export class NotificationFormComponent implements OnInit {
  @Input() editMode = false;
  formNotification:FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toast: MatSnackBar,
  ) { }

  ngOnInit() {
    this.buildForm()
  }


  buildForm(){
    this.formNotification=this.formBuilder.group({
      temat_zgloszenia: new FormControl('',[Validators.required]),
      opis_zgloszenia: new FormControl('',[Validators.required]),
      telefon_kontaktowy: new FormControl(''),
    })}

    
    getErrorMessageTopic() {
      return this.formNotification.get('temat_zgloszenia').hasError('required') ? 'Podaj temat zgłoszenia' :
          '';
    }

    getErrorMessageDescription() {
      return this.formNotification.get('opis_zgloszenia').hasError('required') ? 'Podaj opis zgłoszenia' :
          '';
    }

}
