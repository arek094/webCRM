import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderFormComponent } from '../order-form/order-form.component';
import { Order } from '../../../model/order';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit {
  @ViewChild('orderForm') orderForm: OrderFormComponent;
  order : Order
  numer_zam: string

  
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
    
  ) {  }

  ngOnInit() {
   this.loadOrder()
  }

private loadOrder() {
  const zam_nag_dost_id  = this.route.snapshot.params['zam_nag_dost_id'];
  this.orderService.getItemOrder(zam_nag_dost_id).pipe(tap(order => this.orderForm.setOrder(order['data']))).subscribe(order => 
    { 
      this.order = order['data']
      this.numer_zam = order['data'][0].numer_zam
    });
  }


saveEditOrder(){
  this.spinner.show()
  this.orderService.editOrder(this.order[0].zam_nag_dost_id,this.orderForm.formOrder.value,this.orderForm.deletes_poz,this.orderForm.cancel_poz)
  .subscribe(this.onEditSuccess.bind(this),this.onEditFailure.bind(this))    
}

closeEditOrder(){
  this.router.navigate(['/order-material'])
}


private onEditSuccess(res){
  this.snackBarService.openSnackBar(res,"check_circle","snackbar-success")
  this.router.navigate(['/order-material'])
  this.spinner.hide()
}

private onEditFailure(res){
  this.snackBarService.openSnackBar(res,"error","snackbar-error")
  this.router.navigate(['/order-material'])
  this.spinner.hide()
}



}