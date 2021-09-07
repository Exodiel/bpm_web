import { Component, OnInit } from '@angular/core';
import { Page } from '../../../shared/model/page.model';
import { OrderMapped } from '../../../shared/model/order-mapped';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {
  page = new Page();
  rows = new Array<OrderMapped>();
  constructor(
    private router: Router,
    public toster: ToastrService,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 3;
  }

  ngOnInit(): void {
    this.rows.push(
      new OrderMapped(1, '001-001-000000001', '2021-06-18', 'David Almeida', 1, 'Venta', 'completada', 'EFECTIVO'),
      new OrderMapped(2, '001-001-000000003', '2021-06-12', 'David Almeida', 1, 'Venta', 'completada', 'TARJETA'),
      new OrderMapped(3, '001-001-000000004', '2021-09-06', 'David Almeida', 1, 'Venta', 'procesando', 'CHEQUE'),
    );
  }

  setPage(data) {

  }
}
