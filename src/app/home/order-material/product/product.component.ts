import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogRef } from '@angular/material';
import { Product } from 'src/app/model/product';
import { SelectionModel } from '@angular/cdk/collections';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  displayedColumns: string[] = ['select','nazwa','wytwor_idm','ilosc_magazyn','jm_idn','ilosc_oczekiwana'];
  dataSource: MatTableDataSource<Product>;
  selection = new SelectionModel<Product>(true, []);
  loading: boolean = true;
  products: Product[];


  constructor(
    private orderService: OrderService,
    private dialogRef: MatDialogRef<ProductComponent>,
  ) {
    this.dataSource = new MatTableDataSource(this.products);
   }


  ngOnInit() {
    this.getProduct();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }

  saveProduct(){
    this.dialogRef.close(this.selection.selected);
  }

  closeDialog(){
    this.dialogRef.close([]);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getProduct(){
    this.orderService.getProduct().subscribe(this.onSuccessList.bind(this),this.onFailureList.bind(this))
  }

  private onFailureList(error) {
    console.log("Failure")
  }

  private onSuccessList(res) {
    this.dataSource.data = res['data'];
    this.loading = false;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));   
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
