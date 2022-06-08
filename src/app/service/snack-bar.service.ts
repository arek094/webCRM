import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from '../core/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root'
})

export class SnackBarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  openSnackBar(message:string, icon:string, variant:string) {
    this.snackBar.openFromComponent(SnackBarComponent, {
     data: {message, icon},
     duration: 10000,
     verticalPosition: 'top',
     horizontalPosition: 'center',
     panelClass: [variant],
   });
  }
}
