import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HelpMessageService } from 'src/app/service/help-message.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-help-message',
  templateUrl: './help-message.component.html',
  styleUrls: ['./help-message.component.scss']
})
export class HelpMessageComponent implements OnInit {

  formHelpMessage:FormGroup;

  constructor(
    private dialogRef: MatDialogRef<HelpMessageComponent>,
    private formBuilder: FormBuilder,
    private helpMessageService: HelpMessageService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.buildForm()
  }

   private onSuccess(res){
    this.snackBarService.openSnackBar(res,"check_circle","snackbar-success")
    this.dialogClose()
    this.spinner.hide()
  }

  private onFailure(res){
    this.snackBarService.openSnackBar(res,"error","snackbar-error")
    this.dialogClose()
    this.spinner.hide()
  }

  getErrorMessageSubject() {
    return this.formHelpMessage.get('temat').hasError('required') ? 'Wpisz temat wiadomości' :
      this.formHelpMessage.get('temat').hasError('minlength') ? 'Temat powinien mieć minimum 5 znaków' :
        '';
  }

  getErrorMessageMessage() {
    return this.formHelpMessage.get('wiadomosc').hasError('required') ? 'Wpisz treść wiadomości' :
      this.formHelpMessage.get('wiadomosc').hasError('minlength') ? 'Wiadomośc powinna mieć minimum 5 znaków' :
        '';
  }

  sendHelpMessage(){
    if(this.formHelpMessage.valid){
    this.spinner.show()  
    this.helpMessageService.sendHelpMessage(this.formHelpMessage.value)
    .subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
    }
  }

  private buildForm(){
    this.formHelpMessage=this.formBuilder.group({
      temat: new FormControl('',[Validators.required,Validators.minLength(5)]),
      wiadomosc: new FormControl('',[Validators.required,Validators.minLength(5)]),
    })}

  dialogClose(){
    this.dialogRef.close();
  }

}
