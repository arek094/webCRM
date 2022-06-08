import { Component, OnInit, ChangeDetectionStrategy, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})


export class OrderComponent implements OnInit {

  constructor(
    private router: Router,
    public authService: AuthService
    ) { 
    
  }

  ngOnInit() {
  }

  openNewOrder(){
  this.router.navigate(['/order-material/new'])
}
}
