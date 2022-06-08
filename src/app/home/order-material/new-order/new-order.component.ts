import { Component, ViewChild } from '@angular/core';
import { MatSnackBar} from '@angular/material';
import { OrderFormComponent } from '../order-form/order-form.component';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/service/order.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
})
export class NewOrderComponent  {
  @ViewChild('orderForm') orderForm: OrderFormComponent;
  
  constructor(
    private orderService: OrderService,
    private router: Router,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService
  ) {}

  createOrder(){
    this.spinner.show()
    this.orderService.insertOrder(this.orderForm.formOrder.value)
    .subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
  }

  closeNewOrder(){
    this.router.navigate(['/order-material'])
  }

  private onSuccess(res){
    this.snackBarService.openSnackBar(res,"check_circle","snackbar-success")
    this.router.navigate(['/order-material'])
    this.spinner.hide()
  }

  private onFailure(res){
    this.snackBarService.openSnackBar(res,"error","snackbar-error")
    this.router.navigate(['/order-material'])
    this.spinner.hide()
  }

}
