import { Component, OnInit, Inject } from '@angular/core';
import { Order } from 'src/app/model/order';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrderItem } from 'src/app/model/order-item';
import { OrderSupplierService } from 'src/app/service/order-supplier.service';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.scss']
})
export class SupplierDetailsComponent implements OnInit {

  loading: boolean = true;
  order: Order
  dataSource: MatTableDataSource<OrderItem>;
  displayedColumns: string[] = ['wytwor_idm', 'wytwor_nazwa', 'ilosc_oczekiwana','ilosc_wydana'];

  constructor(
    private orderSupplierService: OrderSupplierService,
    private dialogRef: MatDialogRef<SupplierDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
      this.order=data['orderNag']
      this.refreshList()
    }

  ngOnInit() {
  }

  refreshList(){
    this.orderSupplierService.getOrderSupplierData(this.data['selectedOrder'],'k_zam_poz_dost_szczegoly').subscribe(this.onSuccessList.bind(this),this.onFailureList.bind(this))
  }

  private onSuccessList(res) {
    this.dataSource = new MatTableDataSource(res['data']);
    this.loading = false;
  }

  private onFailureList(error) {
    console.log("Failure")
  }


  dialogClose(){
    this.dialogRef.close();
  }

}
