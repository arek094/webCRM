import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogConfirmComponent } from '../core/dialog-confirm/dialog-confirm.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private dialog: MatDialog
  ) { }


  openConfirmDialog(msg){
    return this.dialog.open(DialogConfirmComponent,{
       data :{
         message : msg
       }
     });
   }
 


}
