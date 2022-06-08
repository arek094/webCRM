import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Order } from '../../../model/order';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { OrderItem } from 'src/app/model/order-item';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrderService } from 'src/app/service/order.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @ViewChild('orderForm') orderForm: OrderFormComponent;
  @ViewChild(MatSort) sort: MatSort;
  user_depot : boolean = false;
  edit : boolean = false;
  order: Order
  loading: boolean = true;
  dataSource: MatTableDataSource<OrderItem>;
  displayedColumns: string[] = ['nr_poz','wytwor_idm', 'wytwor_nazwa', 'jm_idn','ilosc_oczekiwana','ilosc_wydana','uwagi_poz'];
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<DetailsComponent>,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) private data: Order
  ) 
  { 
    this.order=data['orderNag']
    this.refreshList()
  }

  ngOnInit() {
    this.disableBtnEdit()
  }

  refreshList(){
    this.orderService.getOrderMaterialData(this.data['selectedOrder'],'k_zam_poz_dost_szczegoly').subscribe(this.onSuccessList.bind(this),this.onFailureList.bind(this))
  }

  private onSuccessList(res) {
    this.dataSource = new MatTableDataSource(res['data']);
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

  private onFailureList(error) {
    console.log("Failure")
  }

  disableBtnEdit(){
    if ((this.order.status_id[0] != 1 && this.authService.isUserDepot() == false) || (this.order.status_id[0] > 3 && this.authService.isUserDepot() == true)){
      this.edit = true
    } else {
      this.edit = false
    }
  }

  dialogClose(){
    this.dialogRef.close();
  }

  gotoEditOrder(){
    this.dialogClose();
    this.router.navigate(['/order-material',this.order.zam_nag_dost_id])
  }

}
