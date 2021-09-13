import { Component, OnInit } from '@angular/core';
import { Page } from '../../../shared/model/page.model';
import { PagedData } from '../../../shared/model/page-data';
import { OrderMapped } from '../../../shared/model/order-mapped';
import { OrderService } from '../../../shared/services/order.service';
import { OrderResponse } from '../../../shared/interfaces/order/order-response';
import { Pagination } from '../../../shared/interfaces/pagination.interface';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
declare var require
const Swal = require('sweetalert2')

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {
  page = new Page();
  rows = new Array<OrderMapped>();
  constructor(
    private orderService: OrderService,
    private router: Router,
    public toster: ToastrService,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo: Pagination, reload = false) {
    this.page.pageNumber = pageInfo.offset;
    this.orderService.getOrders(this.page.size, (pageInfo.offset * this.page.size)).subscribe(response => {
      let pageData = this.getPageData(this.page, response.data, response.total);
      
      this.page = pageData.page;
      if (reload) {
        this.rows = [...pageData.data];
      } else {
        this.rows = pageData.data;
      }
    });
  }

  private getPageData(page: Page, data: Array<OrderResponse>, total: number): PagedData<OrderMapped> {
    const pagedData = new PagedData<OrderMapped>();
    page.totalElements = total;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min(start + page.size, page.totalElements);
    for (let i = 0; i < data.length; i++) {
      const jsonObj = data[i];
      const order = new OrderMapped(
        jsonObj.id,
        jsonObj.sequential,
        jsonObj.date,
        jsonObj.person.name,
        jsonObj.person.id,
        jsonObj.type,
        jsonObj.state,
        jsonObj.payment,
      );
      pagedData.data.push(order);
    }
    pagedData.page = page;
    return pagedData;
  }

  deleteTransaction(value: OrderMapped) {
    if (value.state === "completado") {
      Swal.fire(
        '!No es posible eliminar la transaccion!',
        'La transaccion se ha confirmado como completada es por tal razon que no puede ser eliminada.',
        'info'
      );
      return;
    }
    Swal.fire({
      title: '¿Estas seguro de eliminar esta transaccion?',
      text: "No podras revertir la accion una vez sea realizada",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.orderService.deleteOrderById(value.id).subscribe(
          (data) => {
            Swal.fire(
              '¡Eliminado!',
              'La transaccion ha sido eliminado con exito.',
              'success'
            );

            this.setPage({ offset: 0 }, true);
          },
          (httpError: HttpErrorResponse) => {
            this.toster.error(httpError.error['message']);
          }
        );
      }
    })
  }

  editProduct(value: OrderMapped) {
    if (value.state === "creado") {
      this.router.navigate(['/orders/update-order/', value.id]);
    } else {
      Swal.fire(
        '!No es posible editar la transaccion!',
        'La transaccion ya se encuentra en proceso de entrega, espere a que culmine el proceso',
        'info'
      );
    }
  }
}
