import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Order } from '../../../model/order';
import { OrderItem } from '../../../model/order-item';
import { Product } from '../../../model/product';
import { AuthService } from '../../../auth/auth.service';
import { OrderValidators } from 'src/app/shared/validators/order-validators';
import { MatDialog } from '@angular/material';
import { ProductComponent } from '../product/product.component';
import { OrderService } from 'src/app/service/order.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';



@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit {
  @Input() editMode = false;
  
  cancel_button : boolean = false;
  ilosc_wydana_edit: boolean = false;
  order_item_edit : boolean = false;
  table_header : boolean = false;
  productLoading = false;
  formOrder:FormGroup;
  products: Product[]
  typDokErpZam : any;
  deletes_poz: Array<any> =[]
  cancel_poz: Array<any> =[] 
  index : number = 0

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService) {
    }

  ngOnInit() {
    this.getProduct()
    this.getTypeDoc()
    this.buildForm()
    this.disableFormNew()
  }


  disableFormNew(){
    if (this.authService.isUserDepot() == false) {
      this.formOrder.get('data_realizacji_magazyn').disable()
      this.formOrder.get('typ_dok_erp_id').disable()
      this.ilosc_wydana_edit = true
      this.cancel_button = true
    }
  }

  get order_item(){
    return this.formOrder.get('order_item') as FormArray
  }

  removeProduct (i: number) {
   this.deletes_poz.push(this.order_item.value[i].zam_poz_dost_id)
   this.order_item.removeAt(i)
  }

  cancelProduct (i: number) {
    this.cancel_poz.push(this.order_item.value[i].zam_poz_dost_id)
    this.order_item.controls[i].patchValue({anulowany: "T"})
   }

   disableInputs() {
    (<FormArray>this.formOrder.get('order_item'))
      .controls
      .forEach(control => {
        control.disable();
      })
  }

  setOrder(order: Order){
    if (order[0].uzytkownik_id_utworzenia != this.authService.user.uzytkownik_id){
      this.formOrder.get('data_realizacji').disable()
      this.formOrder.get('operacja_id').disable()
      this.formOrder.get('kontrahent_id').disable()
      this.formOrder.get('uzytkownik_id_utworzenia').disable()
      this.formOrder.get('uwagi').disable()
      this.order_item_edit = true
    }

    if((this.authService.isUserDepot() == true) && (order[0].status_id == 2)){
      this.ilosc_wydana_edit = true
    }

    if ((this.authService.isUserDepot() == true) && (order[0].status_id == 3)){
      this.formOrder.get('data_realizacji_magazyn').disable()
      this.ilosc_wydana_edit = false
    }



    const {zam_nag_dost_id,operacja_id,kontrahent_id,uzytkownik_id_zatw,uzytkownik_id_utworzenia,anulowany,data_anulowania,status_id,eksport,eksportERP,eksportWMS,magazynierWMS,...formData} = order
    this.formOrder.patchValue(formData[0])
    formData[0].order_item.forEach(orderItem => this.additem(orderItem))
  }

  onChange($event,index) {
    if($event){
      this.order_item.controls[index].patchValue({jm_idn: $event.jm_idn,jm_id: $event.jm_id})
    } else {
      this.order_item.controls[index].reset({jm_idn: "", jm_id: "" });
    }
  }

 additem(orderItem? : OrderItem){
    this.order_item.push(this.buildItem(orderItem))
  }


buildItem(orderItem: OrderItem = {} as OrderItem) {
    return this.formBuilder.group({
      anulowany: [{value:orderItem.anulowany, disabled:false}],
      wytwor_id: [{value:orderItem.wytwor_id, disabled:this.order_item_edit}, [Validators.required]],
      ilosc_oczekiwana: [{value:orderItem.ilosc_oczekiwana, disabled:this.order_item_edit},[Validators.required]],
      ilosc_wydana: [{value:orderItem.ilosc_wydana, disabled: this.ilosc_wydana_edit}],
      uwagi_poz: [{value:orderItem.uwagi_poz, disabled: false}],
      jm_idn: [{value:orderItem.jm_idn, disabled: false}],
      jm_id: [{value:orderItem.jm_id, disabled: false}],
      czy_zamowienie_roznicowe: [{value: orderItem.czy_zamowienie_roznicowe == true ? true : orderItem.czy_zamowienie_roznicowe == false ? false : null, disabled:this.ilosc_wydana_edit}],
      zam_poz_dost_id: orderItem.zam_poz_dost_id || ''
    });
  }

  private buildForm(){
    this.formOrder=this.formBuilder.group({
      data_realizacji: new FormControl('',[Validators.required,OrderValidators.data_realizacji]),
      data_realizacji_magazyn: new FormControl(''),
      operacja_id: new FormControl(1),
      typ_dok_erp_id: new FormControl(''),
      kontrahent_id: new FormControl(this.authService.user.kontrahent_id),
      uzytkownik_id_utworzenia: new FormControl(this.authService.user.uzytkownik_id),
      uwagi: new FormControl(''),
      order_item: (this.formBuilder.array(this.editMode ? [] : []))
    })}

    getErrorMessageDataRealizacji() {
      return this.formOrder.get('data_realizacji').hasError('required') ? 'Podaj datę realizacji' :
      this.formOrder.get('data_realizacji').hasError('data_realizacji') ? 'Data realizacji musi być poźniejsza o conajmniej dwa dni od dzisiejszej daty' :
          '';
    }

    getTypeDoc(){
      this.orderService.getOrderMaterialData(null,'t_typ_dok_erp_zam').subscribe(this.onSuccessListTypeDoc.bind(this),this.onFailureListTypeDoc.bind(this))
    }

    private onFailureListTypeDoc(error) {
      console.log("Failure")
    }
  
    private onSuccessListTypeDoc(res) {
      this.typDokErpZam = res['data'];
    }

    getProduct(){
      this.orderService.getProduct().subscribe(this.onSuccessList.bind(this),this.onFailureList.bind(this))
    }

    private onFailureList(error) {
      console.log("Failure")
    }
  
    private onSuccessList(res) {
      this.products = res['data'];
      this.productLoading = false;
    }
    
  openDialogProduct(){
     let dialogRef =  this.dialog.open(ProductComponent, {
        panelClass: 'matDialog',
        minWidth: '700px',
        disableClose: true
      })
        dialogRef.afterClosed().subscribe(result => 
          result.forEach(result => {
            this.additem(result)
          })
        )}
    }
  

    



    

